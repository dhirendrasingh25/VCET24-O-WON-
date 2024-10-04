import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const question = [
      {
        question: "Do you currently track your monthly income and expenses?",
        type: "multiple_choice",
        options: ["Yes, regularly", "Sometimes", "No, not at all"],
      },
      {
        question: "How do you typically save money?",
        type: "multiple_choice",
        options: [
          "I have a dedicated savings account",
          "I save cash or set it aside informally",
          "I don't save regularly",
        ],
      },
      {
        question: "What do you do when you have unexpected expenses?",
        type: "multiple_choice",
        options: [
          "Use savings or an emergency fund",
          "Use a credit card or take out a loan",
          "I struggle to cover them",
        ],
      },
      {
        question: "Do you have a monthly budget plan?",
        type: "multiple_choice",
        options: ["Yes", "No", "I’m planning to start one"],
      },
      {
        question: "How do you manage debt, if you have any?",
        type: "multiple_choice",
        options: [
          "I make regular payments and keep track",
          "I pay when I can but it’s hard to manage",
          "I don’t have any debt",
        ],
      },
      {
        question: "What is your primary financial goal right now?",
        type: "multiple_choice",
        options: [
          "Building savings",
          "Paying off debt",
          "Managing daily expenses",
          "Investing for the future",
        ],
      },
    ];

    const { responses } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    async function run() {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Explicitly ask for JSON and guide the AI
      const prompt = `
        Go through this JSON file of questionnaire: ${JSON.stringify(question)} 
        and generate 4-5 fields and give a score to the user based on the responses: ${JSON.stringify(
          responses
        )}.
        Provide only valid JSON. Do not include any other text or explanations.`;

      const result = await model.generateContent(prompt);

      // Clean the response by removing backticks and any unwanted characters
      const cleanedResponse = result.response.text().replace(/`/g, "").trim();

      // Extract the JSON response and send it
      try {
        const jsonResponse = JSON.parse(cleanedResponse);
        res.send(jsonResponse);
      } catch (error) {
        // Handle if the AI response is not valid JSON
        res.status(500).send({ error: "Failed to parse response as JSON" });
      }
    }

    await run();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
