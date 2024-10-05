import { plaidClient } from "../index.js";
import express from "express";

const router = express.Router();

// Plaid API routes
router.post("/create_link_token", async (req, res) => {
    const plaidRequest = {
        user: {
            client_user_id: "66fecc4237a1ca001ab69530",
        },
        client_name: "Your App Name",
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

router.post("/auth", async (req, res) => {
    try {
        const access_token = req.body.access_token;
        const plaidRequest = { access_token };
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        res.json(plaidResponse.data);
    } catch (e) {
        res.status(500).send("failed");
    }
});

router.post("/exchange_public_token", async (req, res) => {
    const publicToken = req.body.public_token;
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const accessToken = plaidResponse.data.access_token;
        res.json({ accessToken });
    } catch (error) {
        res.status(500).send("failed");
    }
});

export default router;
