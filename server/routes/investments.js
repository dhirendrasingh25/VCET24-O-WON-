import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import Profile from '../models/profileSchema.js';  // Import the Profile model

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      dob,
      occupation,
      ailments,
      dependents,
      dependantDescription,
      goal,
      monthly_income
      ,
      mandatoryExpenses,
      currentInvestments,
      duration,
      loans,
      emi,
    } = req.body;

    // Create a new profile entry in the database
    // const newProfile = new Profile({
    //   age,
    //   occupation,
    //   ailments,
    //   dependents,
    //   dependantDescription,
    //   goal,
    //   mandatoryExpenses,
    //   currentInvestments,
    //   duration,
    //   loans,
    //   emi,
    // });

    // Save the profile to the database
    // await newProfile.save();

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `User age is ${age}, occupation: ${occupation}, ailments: ${ailments}, dependents: ${dependents} (${dependantDescription}), goal: ${goal},monthly income: ${monthly_income} ,mandatory expenses: ${mandatoryExpenses}, current investments: ${JSON.stringify(currentInvestments)}, expected investment duration: ${duration}, loans: ${loans}, and EMI: ${emi}. Please provide a list of recommended investment plans in the following JSON format: { "investmentPlans": [ { "planName": "string", "description": "string", "allocation": { "Equity Funds": number, "Debt Funds": number }, "recommendedFunds": [ { "fundName": "string", "fundType": "string" } ], "monthlyInvestment": number } ] }. The output must be strictly JSON, with no additional text, backticks, or explanations outside the JSON structure.`;



    const result = await model.generateContent(prompt);

    // Return the generated response as JSON
    res.json(JSON.parse(result.response.text())); // Parse and send as JSON
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

export default router;
