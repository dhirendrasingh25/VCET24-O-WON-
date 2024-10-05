import express from "express";
import Transaction from "../models/transactionSchema.js";
import mongoose from "mongoose";
import User from "../models/userSchema.js";

const router = express.Router();

router.get("/get-transactions", async (req, res) => {
    try {
      const { email_id } = req.query;  // Get email_id from URL params
  
      // Find the user by email and populate the transactions
      const user = await User.findOne({ email_id }).populate('transactions').exec();
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      if (user.transactions.length > 0) {
        res.status(200).json({
          success: true,
          transactions: user.transactions,  // Send the populated transactions
        });
      } else {
        res.status(404).json({ success: false, message: "No transactions found for this user." });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Error retrieving transactions", error });
    }
  });

  router.get("/get-transaction-summary", async (req, res) => {
    try {
      const { email_id } = req.query; 

  
      // Find the user by email and populate transactions
      const user = await User.findOne({ email_id }).populate('transactions').exec();
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      const transactions = user.transactions || [];
  
      // Calculate the total transaction amount
      const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
      // Find the maximum transaction amount
      const maxAmount = transactions.reduce((max, transaction) => (transaction.amount > max ? transaction.amount : max), 0);
  
      // Number of transactions
      const transactionCount = transactions.length;
  
      // Default value for savings is 0
      const totalSavings = user.savings || 0;
  
      // Return summary details
      res.status(200).json({
        success: true,
        message: "Transaction summary retrieved successfully",
        data: {
          transactionCount,
          maxAmount,
          totalAmount,
          totalSavings
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error retrieving transaction summary", error });
    }
  });
  
  // POST: Add a new transaction with savings field in User model
  router.post("/add-transaction", async (req, res) => {
    try {
      const { email_id, description, amount, date, category, savings } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email_id });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      // Create a new transaction
      const newTransaction = new Transaction({
        description,
        amount,
        date,
        category,
      });
  
      // Save the transaction
      await newTransaction.save();
  
      // Add the transaction to the user's transactions array
      user.transactions.push(newTransaction);
  
      // Update user's savings (optional, if provided in the request body)
      if (savings !== undefined) {
        user.savings = savings;
      }
  
      // Save the updated user
      await user.save();
  
      // Respond with success and the created transaction
      res.status(201).json({
        success: true,
        message: "Transaction added successfully",
        transaction: newTransaction,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error adding transaction", error });
    }
  });
  
  // Helper function to check if a date is within the last 'days' days

  router.get("/get-transactions-weekly", async (req, res) => {
    try {
      const { email_id } = req.query;
  
      if (!email_id) {
        return res.status(404).json({ success: false, message: "Email not found." });
      }
  
      // Find the user by email and populate the transactions
      const user = await User.findOne({ email_id }).populate("transactions").exec();
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      // Calculate the date 7 days ago from today
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      // Aggregate transactions by day for the last 7 days
      const weeklyTransactions = await Transaction.aggregate([
          {
              $match: {
                  _id: {
                      $in: user.transactions.map(
                          (t) => new mongoose.Types.ObjectId(t._id)
                      ),
                  },
                  date: { $gte: sevenDaysAgo }, // Match transactions from the last 7 days
              },
          },
          {
              $group: {
                  _id: {
                      day: { $dayOfMonth: '$date' },
                      month: { $month: '$date' },
                      year: { $year: '$date' },
                  },
                  totalAmount: { $sum: '$amount' },
                  count: { $sum: 1 },
              },
          },
          {
              $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
          },
      ]);
  
      // Format the result for easy plotting in a bar graph
      const formattedData = weeklyTransactions.map((item) => ({
        day: `Year ${item._id.year}, Month ${item._id.month}, Day ${item._id.day}`,
        totalAmount: item.totalAmount,
        count: item.count
      }));
  
      res.status(200).json({
        success: true,
        message: "Weekly transactions aggregated by day successfully",
        data: formattedData
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error retrieving weekly transactions",
        error: error.message
      });
    }
  });
  

  router.get("/get-transactions-monthly", async (req, res) => {
    try {
      const { email_id } = req.query;
  
      if (!email_id) {
        return res.status(404).json({ success: false, message: "Email not found." });
      }
  
      // Find the user by email and populate the transactions
      const user = await User.findOne({ email_id }).populate("transactions").exec();
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      // Calculate the date 4 weeks (28 days) ago from today
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
      // Aggregate transactions by week for the last 4 weeks
      const monthlyTransactions = await Transaction.aggregate([
        {
          $match: {
            _id: { $in: user.transactions.map((t) => mongoose.Types.ObjectId(t._id)) },
            date: { $gte: fourWeeksAgo } // Match transactions from the last 4 weeks
          }
        },
        {
          $group: {
            _id: { week: { $week: "$date" }, year: { $year: "$date" } },
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.week": 1 }
        }
      ]);
  
      // Format the result for easy plotting in a bar graph
      const formattedData = monthlyTransactions.map((item) => ({
        week: `Year ${item._id.year}, Week ${item._id.week}`,
        totalAmount: item.totalAmount,
        count: item.count
      }));
  
      res.status(200).json({
        success: true,
        message: "Monthly transactions aggregated by week successfully",
        data: formattedData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving monthly transactions",
        error
      });
    }
  });
  
  


  router.post("/add-transaction", async (req, res) => {
    try {
      const { email_id, description, amount, date, category } = req.body;

      const user = await User.findOne({ email_id });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      const newTransaction = new Transaction({
        description,
        amount,
        date,
        category,
      });

      await newTransaction.save();

      user.transactions.push(newTransaction);

      await user.save();
      res.status(201).json({
        success: true,
        message: "Transaction added successfully",
        transaction: newTransaction,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error adding transaction", error });
    }
  });
  router.get("/get-transaction-summary", async (req, res) => {
    try {
      const { email_id } = req.query;  
      const user = await User.findOne({ email_id }).populate('transactions').exec();
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      const transactions = user.transactions || [];
      if (transactions.length === 0) {
        return res.status(404).json({ success: false, message: "No transactions found for this user." });
      }
      const numberOfTransactions = transactions.length;
      const totalTransactionAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      const maxTransactionAmount = Math.max(...transactions.map(transaction => transaction.amount));
  
      // Respond with the calculated summary
      res.status(200).json({
        success: true,
        numberOfTransactions,
        totalTransactionAmount,
        maxTransactionAmount
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error retrieving transaction summary", error });
    }
  });


  router.get("/getall-transactions-summary", async (req, res) => {
    try {
      const { email_id } = req.query;  // Get email_id from URL params
  
      // Find the user by email and populate the transactions
      const user = await User.findOne({ email_id }).populate('transactions').exec();
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      const transactions = user.transactions || [];
      const currentDate = new Date();
  
      // Initialize summary objects
      const summary = {
        weekly: [],
        monthly: [],
        yearly: []
      };
  
      // Iterate through transactions and categorize them
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);  // Ensure transaction date is a Date object
  
        if (isWithinLastDays(transactionDate, 7)) {
          summary.weekly.push(transaction);
        }
        if (isWithinLastDays(transactionDate, 30)) {
          summary.monthly.push(transaction);
        }
        if (isWithinLastDays(transactionDate, 365)) {
          summary.yearly.push(transaction);
        }
      });
  
      res.status(200).json({
        success: true,
        summary
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error retrieving transactions summary", error });
    }
  });
  
  // Helper function to check if a date is within the last 'days' days
  function isWithinLastDays(date, days) {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);
    return date >= pastDate && date <= now;
  }
  

export default router;
