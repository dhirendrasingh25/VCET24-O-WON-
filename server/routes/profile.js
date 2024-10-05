import express from "express";
import Profile from "../models/profileSchema.js";
import User from "../models/userSchema.js";
import Transaction from "../models/transactionSchema.js";

const router = express.Router();

// GET route to fetch quiz data by ID
router.get("/profile/:id", async (req, res) => {
    try {
        const profileData = await Profile.findById(req.params.id); // Using req.params.id to query the database
        if (!profileData) {
            return res
                .status(404)
                .json({ success: false, message: "Profile data not found" });
        }
        res.json(profileData);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST route to create a new quiz entry
router.post("/", async (req, res) => {
    try {
        const { email_id, formData } = req.body;

        const user = await User.findOne({ email_id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with the provided email ID not found",
            });
        }

        const profileData = new Profile({
            ...formData,
        });

        const newProfileData = await profileData.save();

        user.profile = newProfileData._id;
        user.complete_profile = true;

        await user.save();

        res.json({
            sucess: true,
            message: "Profile updated successfully",
            user,
            newProfileData,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.get("/get-user", async (req, res, next) => {
    try {
        const { email_id } = req.query;

        if (!email_id) {
            return res
                .status(400)
                .json({ success: false, message: "Email ID is required." });
        }

        const user = await User.findOne({ email_id }).populate("profile");

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

router.get("/current-savings", async (req, res, next) => {
    try {
        const { email_id } = req.query;

        // Check if email_id is provided
        if (!email_id) {
            return res
                .status(400)
                .json({ success: false, message: "Email ID is required." });
        }

        // Find the user and populate profile and transactions
        const user = await User.findOne({ email_id }).populate("profile"); // Assuming `profile` has `monthly_income`

        // Check if user exists
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        // Check if profile exists and has monthly_income
        const monthlyIncome = user.profile.monthly_income;
        if (!monthlyIncome) {
            return res.status(400).json({
                success: false,
                message: "Monthly income not found in profile.",
            });
        }

        // Get the current date for month filtering
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const transactions = await Transaction.find({
            user: user._id,
            transaction_date: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1),
            },
        });

        // Calculate the total expenses from transactions
        const totalExpenses = transactions.reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

        // Calculate savings by subtracting total expenses from monthly income
        const savings = monthlyIncome - totalExpenses;

        // Return the savings in the response
        return res.status(200).json({
            success: true,
            savings: savings,
            monthlyIncome: monthlyIncome,
            totalExpenses: totalExpenses,
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
