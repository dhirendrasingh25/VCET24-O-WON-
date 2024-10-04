import express from 'express';
import Transaction from '../models/transactionSchema.js';
import mongoose from 'mongoose';

const router = express.Router();

// Function to calculate expenses based on email and date range
async function calculateExpenses(email_id, startDate, endDate) {
    try {
        console.log(email_id)
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
        console.log(totalExpenses)
        return totalExpenses.length ? totalExpenses[0].totalAmount : 0;
    } catch (error) {
        throw error;
    }
}

// Helper function to get start date for different periods
function getStartDate(period) {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to beginning of the day
    const startDate = new Date(now);
    
    switch(period) {
        case 'weekly':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'monthly':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'yearly':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            throw new Error('Invalid period');
    }
    
    return startDate;
}

// Function to format date to yyyy-mm-dd
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Generic expense route for weekly, monthly, and yearly calculations
router.get('/:period/:email_id', async (req, res) => {
    try {
        const { email_id, period } = req.params;

        if (!['weekly', 'monthly', 'yearly'].includes(period)) {
            return res.status(400).json({ error: `Invalid period: ${period}. Must be 'weekly', 'monthly', or 'yearly'.` });
        }

        const startDate = getStartDate(period);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // Set to end of the day

        console.log(`Calculating ${period} expenses for ${email_id} from ${formatDate(startDate)} to ${formatDate(endDate)}`);

        const totalExpenses = await calculateExpenses(email_id, startDate, endDate);
        res.status(200).json({ 
            success: true, 
            [`${period}Expenses`]: totalExpenses,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        });
    } catch (error) {
        console.error(`Error calculating expenses: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export default router;