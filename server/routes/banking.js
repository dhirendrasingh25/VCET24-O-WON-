import express from "express";
import BankAccount from "../models/bankingSchema.js";
import User from "../models/userSchema.js";
const router = express.Router();

router.post("/create-bank-accounts", async (req, res) => {
    const {
        email,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
    } = req.body;

    try {
        // Create a new bank account document
        const bankAccount = new BankAccount({
            email,
            bankId,
            accountId,
            accessToken,
            fundingSourceUrl,
            shareableId,
        });

        await bankAccount.save();

        await User.findOneAndUpdate(email, {
            $addToSet: { bankAccounts: bankAccount._id },
        });

        res.status(201).json({ success: true, bankAccount });
    } catch (error) {
        console.error("Error creating bank account:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

router.get("/get-banks", async (req, res) => {
    try {
        const { email } = req.query;
        const banks = await BankAccount.find({ email });
        res.status(200).json({ success: true, banks });
    } catch (error) {
        console.error("Error fetching banks:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

router.get("/get-bank", async (req, res) => {
    try {
        const { bankId } = req.query;
        const bank = await BankAccount.findById(bankId);
        res.status(200).json({ success: true, bank });
    } catch (error) {
        console.error("Error fetching bank:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

router.get("/get-bank-by-account-id", async (req, res) => {
    try {
        const { accountId } = req.query;
        const bank = await BankAccount.findOne({ accountId });
        res.status(200).json({ success: true, bank });
    } catch (error) {
        console.error("Error fetching bank:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

export default router;
