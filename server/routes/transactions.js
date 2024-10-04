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


  router.post("/add-transaction", async (req, res) => {
    try {
      const { email_id, description, amount, date, category } = req.body;
  
      // Find the user by email_id
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

export default router;
