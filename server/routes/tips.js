import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import finnhub from "finnhub";

// Initialize the Express router
const router = express.Router();
import dotenv from "dotenv";

dotenv.config();

// Initialize Finnhub API
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "crvn3s9r01qkji45mnf0crvn3s9r01qkji45mnfg";
const finnhubClient = new finnhub.DefaultApi();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY,); // Set the API key in your environment variables

// Function to fetch the latest market news from Finnhub
async function fetchLatestMarketNews() {
    return new Promise((resolve, reject) => {
        finnhubClient.marketNews("general", {}, (error, data, response) => {
            if (error) {
                reject("Error fetching market news:", error);
                return;
            }

            if (data.length > 0) {
                const latestArticle = data[0];
                const formattedArticle = {
                    category: latestArticle.category,
                    datetime: new Date(
                        latestArticle.datetime * 1000,
                    ).toISOString(),
                    headline: latestArticle.headline,
                    id: latestArticle.id,
                    image: latestArticle.image,
                    source: latestArticle.source,
                    summary: latestArticle.summary,
                    url: latestArticle.url,
                };
                resolve(formattedArticle);
            } else {
                resolve(null);
            }
        });
    });
}

// Function to generate top 3 investment plans using Google Generative AI
async function generateInvestmentTips() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
        "Give me best and top only 1 investment plan for todays date in json form. having name and desc and no other key.just the json having one plan nothing else.also no backtick and json should be written. ";

    const result = await model.generateContent(prompt);
    return result.response.text(); // This will return the JSON string
}

// Define the route to get both tips and news
router.get("/", async (req, res) => {
    try {
        // Fetch the investment tips
        const investmentTips = await generateInvestmentTips();

        // Fetch the latest market news
        const marketNews = await fetchLatestMarketNews();

        // Return the results
        res.status(200).json({
            success: true,
            investmentTips: JSON.parse(investmentTips), // Parse the JSON response from Google AI
            marketNews: marketNews || "No latest news available",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
