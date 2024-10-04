import mongoose from "mongoose";

// schema
const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Transport", "Entertainment", "Shopping", "Other"], // Example categories
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
