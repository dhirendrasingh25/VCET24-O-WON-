import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/", (req, res, next) => {
  try {

    const question =  [
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
    ]
    const {
      responses
    } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    async function run() {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Go through this JSON file of questionnaire: ${JSON.stringify(question)} and generate 4-5 fields and give a score to the user based on the responses: ${JSON.stringify(responses)}. Make the user feel that our finance website is very good and encourage them to create an account. give numerical data as i would need to give some statistics. give only json form no other text`;
      const result = await model.generateContent(prompt);
      res.send(result.response.text());
    }
    run();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
