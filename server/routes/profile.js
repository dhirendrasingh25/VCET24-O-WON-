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

router.post("/update-user", async (req, res, next) => {
    try {
        const { email_id, dwallaCustomerId } = req.body;

        const user = await User.findOneAndUpdate(
            { email_id },  
            { $set: { dwallaCustomerId } },  
            { new: true }  
        );

        // If user is not found
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Return success and the updated user data
        return res.status(200).json({ success: true, message: "User updated successfully.", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
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


router.get("/budget", async (req, res, next) => {
    try {
        const { email_id } = req.query;

        const userProfile = await User.findOne({ email_id }).populate("profile");

        if (!userProfile) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const profile = userProfile.profile;

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile data not found" });
        }

        // Ensure all required fields are present
        const { monthlyIncome, mandatoryExpenses, emi } = profile;

        if (monthlyIncome === undefined || mandatoryExpenses === undefined || emi === undefined) {
            return res.status(400).json({ success: false, message: "Profile data incomplete" });
        }

        // Convert values to numbers to avoid NaN issues
        const income = Number(monthlyIncome);
        const expenses = Number(mandatoryExpenses);
        const emiAmount = Number(emi);

        // Calculate disposable income
        const disposableIncome = income - (expenses + emiAmount);

        if (disposableIncome <= 0) {
            return res.status(200).json({
                success: true,
                message: "Your expenses exceed your income. Consider reducing debts or expenses.",
                disposableIncome: disposableIncome,
                budgetSuggestion: null,
            });
        }

        // Suggest budget allocation
        const budgetSuggestion = {
            savings: (disposableIncome * 0.30).toFixed(2), 
            investments: (disposableIncome * 0.20).toFixed(2), 
            leisure: (disposableIncome * 0.50).toFixed(2),
        };

        return res.status(200).json({
            success: true,
            disposableIncome: disposableIncome.toFixed(2),
            budgetSuggestion,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
});




router.get("/budget", async (req, res, next) => {
    try {
        const { email_id } = req.query;

        const userProfile = await User.findOne({ email_id }).populate("profile");

        if (!userProfile) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const profile = userProfile.profile;

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile data not found" });
        }

        // Ensure all required fields are present
        const { monthlyIncome, mandatoryExpenses, emi } = profile;

        if (monthlyIncome === undefined || mandatoryExpenses === undefined || emi === undefined) {
            return res.status(400).json({ success: false, message: "Profile data incomplete" });
        }

        // Convert values to numbers to avoid NaN issues
        const income = Number(monthlyIncome);
        const expenses = Number(mandatoryExpenses);
        const emiAmount = Number(emi);

        // Calculate disposable income
        const disposableIncome = income - (expenses + emiAmount);

        if (disposableIncome <= 0) {
            return res.status(200).json({
                success: true,
                message: "Your expenses exceed your income. Consider reducing debts or expenses.",
                disposableIncome: disposableIncome,
                budgetSuggestion: null,
            });
        }

        // Suggest budget allocation
        const budgetSuggestion = {
            savings: (disposableIncome * 0.30).toFixed(2), 
            investments: (disposableIncome * 0.20).toFixed(2), 
            leisure: (disposableIncome * 0.50).toFixed(2),
        };

        return res.status(200).json({
            success: true,
            disposableIncome: disposableIncome.toFixed(2),
            budgetSuggestion,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
});



router.get("/current-savings", async (req, res, next) => {
    try {
        const { email_id } = req.query;

        if (!email_id) {
            return res.status(400).json({ success: false, message: "Email ID is required." });
        }

        const user = await User.findOne({ email_id }).populate("profile");


        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }


        const monthlyIncome = user.profile.monthlyIncome;
        if (!monthlyIncome) {
            return res.status(400).json({ success: false, message: "Monthly income not found in profile." });
        }

        // Get the current date for month filtering
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Calculate total expenses using aggregation
        const expensesResult = await Transaction.aggregate([
            {
                $match: {
                    user: user._id,
                    transaction_date: {
                        $gte: new Date(currentYear, currentMonth, 1),
                        $lt: new Date(currentYear, currentMonth + 1, 1),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$amount" },
                },
            },
        ]);

        // Extract total expenses from aggregation result
        const totalExpenses = expensesResult.length > 0 ? expensesResult[0].totalExpenses : 0;

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
