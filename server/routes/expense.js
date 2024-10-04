import express from 'express';
import User from '../models/userSchema.js';
import mongoose from 'mongoose';

const router = express.Router();

// Function to calculate expenses based on email and date range
async function calculateExpenses(email_id, startDate, endDate) {
    try {
        console.log(`Calculating expenses for ${email_id} from ${startDate} to ${endDate}`);
        
        const user = await User.findOne({ email_id: email_id }).populate({
            path: 'transactions',
            match: {
                date: { $gte: startDate, $lte: endDate }
            }
        });

        console.log(`Found user: ${user ? 'Yes' : 'No'}`);
        
        if (!user) {
            console.log('No user found with the given email_id');
            return 0;
        }

        console.log(`Found ${user.transactions.length} matching transactions`);

        const totalExpenses = user.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        
        console.log('Total expenses:', totalExpenses);
        
        return totalExpenses;
    } catch (error) {
        console.error('Error in calculateExpenses:', error);
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