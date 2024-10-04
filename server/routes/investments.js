import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/", (req, res, next) => {
  try {
    const {
      age,
      ailments,
      lifestyle,
      dependents,
      goal,
      expenses,
      current_investments,
      duration,
      review,
    } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    async function run() {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Age of the user is ${age}, ailments: ${
        ailments || "none"
      }, lifestyle is ${lifestyle}, dependents: ${dependents}, goals: ${goal}, monthly expenses: ${expenses}, current investments: ${current_investments}, expected investment duration: ${duration} years, and a review: ${review}. Can you suggest some results so that the user likes our system and uses it?Something good which user might like it about them.Dont suggest investment plans. Provide the answer in JSON format.Give just the json data in curly braces no other thing outside that json.Each score should be out of 100% and final also 100%`;
      const result = await model.generateContent(prompt);
      res.send(result.response.text());
    }
    run();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
