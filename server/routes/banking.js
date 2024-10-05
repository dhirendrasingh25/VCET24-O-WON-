import express from "express";
import BankAccount from "../models/bankingSchema.js";
const router = express.Router();

router.post("/create-bank-accounts", async (req, res) => {
    const {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
    } = req.body;

    try {
        // Create a new bank account document
        const bankAccount = new BankAccount({
            userId,
            bankId,
            accountId,
            accessToken,
            fundingSourceUrl,
            shareableId,
        });

        await bankAccount.save();

        res.status(201).json({ success: true, bankAccount });
    } catch (error) {
        console.error("Error creating bank account:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

export default router;
