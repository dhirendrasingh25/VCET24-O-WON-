import express from "express";
import finnhub from "finnhub";

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "crvn3s9r01qkji45mnf0crvn3s9r01qkji45mnfg"; // Replace with your API key
const finnhubClient = new finnhub.DefaultApi();

// Create a router object
const router = express.Router();

// Define the /news endpoint
router.get("/", async (req, res) => {
    try {
        await finnhubClient.marketNews(
            "general",
            {},
            (error, data, _) => {
                if (error) {
                    throw error;
                }

                // Slice to get the top 20 latest market news
                const top20News = data.slice(0, 20);

                // Send the JSON response
                res.status(200).json(top20News);
            },
        );
    } catch (error) {
        console.error("Error fetching news data:", error);
        res.status(500).send({
            error: "Error fetching news data",
        });
    }
});

export default router;
