import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import finnhub from "finnhub";

const router = express.Router();


const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "crvn3s9r01qkji45mnf0crvn3s9r01qkji45mnfg";
const finnhubClient = new finnhub.DefaultApi();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); 

async function fetchLatestMarketNews() {
    return new Promise((resolve, reject) => {
        finnhubClient.marketNews("general", {}, (error, data, response) => {
            if (error) {
                reject("Error fetching market news: " + error);
                return;
            }

            if (data.length > 0) {
                const latestArticle = data[0];
                const formattedArticle = {
                    category: latestArticle.category,
                    datetime: new Date(latestArticle.datetime * 1000).toISOString(), // Convert to readable date format
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

async function generateInvestmentTips() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
        "Give me best and top only 1 investment plan for today's date in json form. having name and desc and no other key. just the json having one plan nothing else. also no backtick and json should be written.";

    const result = await model.generateContent(prompt);
    return result.response.text();
}

router.get("/investment-tips", async (req, res) => {
    try {
        const investmentTips = await generateInvestmentTips();
        res.status(200).json({
            success: true,
            investmentTips: JSON.parse(investmentTips),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/market-news", async (req, res) => {
    try {

        const marketNews = await fetchLatestMarketNews();
        res.status(200).json({
            success: true,
            marketNews: marketNews || "No latest news available",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
