import express from 'express';
import Transaction from '../models/transactionSchema.js';
import mongoose from 'mongoose';

const router = express.Router();

// Function to calculate expenses based on email and date range
async function calculateExpenses(email_id, startDate, endDate) {
    try {
        const totalExpenses = await Transaction.aggregate([
            {
                $match: {
                    email_id: email_id,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        return totalExpenses.length ? totalExpenses[0].totalAmount : 0;
    } catch (error) {
        throw error;
    }
}

// Helper function to get start date
function getStartDate(period) {
    const now = new Date();
    switch (period) {
        case 'weekly':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        case 'monthly':
            return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        case 'yearly':
            return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        default:
            throw new Error(`Invalid period: ${period}`);
    }
}

// Generic expenses route
router.get('/weekly/:email_id', async (req, res) => {
    try {
        const {  email_id } = req.params;
        
        // if (!['weekly', 'monthly', 'yearly'].includes(period)) {
        //     return res.status(400).json({ error: `Invalid period: ${period}. Must be 'weekly', 'monthly', or 'yearly'.` });
        // }

        const startDate = getStartDate('weekly');
        const endDate = new Date();

        console.log(`Calculating weekly expenses for ${email_id} from ${startDate} to ${endDate}`);

        const totalExpenses = await calculateExpenses(email_id, startDate, endDate);
        res.status(200).json({ success: true, [`Weekly Expenses`]: totalExpenses });
    } catch (error) {
        console.error(`Error calculating expenses: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export default router;