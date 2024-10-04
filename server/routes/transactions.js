import express from "express";
import Transaction from "../models/transactionSchema.js";
import User from "../models/userSchema.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST add a new transaction
router.post("/add-transaction", async (req, res) => {
  try {
    const { email_id, amount, date, category } = req.body;
    const id = uuidv4();

    // Create a new transaction associated with the user
    const newTransaction = new Transaction({
        
      email_id, 
      amount,
      date,
      category,
    });

    await newTransaction.save();

    // Send response
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
