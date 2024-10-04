import express from 'express';
import Transaction from '../models/transactionSchema.js';

const router = express.Router();

// POST add a new transaction
router.post('/add-transaction', async (req, res) => {
    try {
        const { amount, date, category } = req.body;

        // Create a new transaction
        const newTransaction = new Transaction({
            amount,
            date,
            category
        });

        await newTransaction.save();

        res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error adding transaction', error });
    }
});

export default router;
