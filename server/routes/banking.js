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

router.post("/create_link_token", async (req, res) => {
    const plaidRequest = {
        user: {
            client_user_id: req.body.userId ,
        },
        client_name: req.body.userName,
        products: ["auth"],
        language: "en",
        redirect_uri: "https://localhost:3000",
        country_codes: ["US"],
    };

    try {
        const createTokenResponse =
            await plaidClient.linkTokenCreate(plaidRequest);
        res.json(createTokenResponse.data);
    } catch (error) {
        console.error("Error creating link token:", error);
        res.status(500).json({
            error: "Failed to create link token",
            details: error.message,
        });
    }
});

export default router;
