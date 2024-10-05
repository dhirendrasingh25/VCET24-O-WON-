import express from "express";
import finnhub from "finnhub";

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "crvn3s9r01qkji45mnf0crvn3s9r01qkji45mnfg"; // Replace with your API key
const finnhubClient = new finnhub.DefaultApi();

// Create a router object
const router = express.Router();

// Define the /news endpoint
router.get("/", (req, res) => {
    finnhubClient.marketNews("general", {}, (error, data, response) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).send({ error: "Error fetching news data" });
        }

        // Slice to get the top 20 latest market news
        const top20News = data.slice(0, 20);

        // Send the JSON response
        res.status(200).json(top20News);
    });
});

export default router;
