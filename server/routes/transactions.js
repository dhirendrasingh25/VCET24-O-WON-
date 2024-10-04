import express from "express";
import Transaction from "../models/transactionSchema.js";
import mongoose from "mongoose";

const router = express.Router();


  
// POST add a new transaction
router.post("/add-transaction", async (req, res) => {
  try {
    const { description,amount, date, category } = req.body;

    // Create a new transaction
    const newTransaction = new Transaction({
        description,
      amount,
      date,
      category,
    });

    await newTransaction.save();

    res
      .status(201)
      .json({success:true,
        message: "Transaction added successfully",
        transaction: newTransaction,
      });
  } catch (error) {
    res.status(500).json({ success:false,message: "Error adding transaction", error });
  }
});

export default router;
