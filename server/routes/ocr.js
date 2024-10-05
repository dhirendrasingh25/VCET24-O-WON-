import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Adjust this path accordingly
import User from "../models/userSchema.js"
import Transaction from "../models/transactionSchema.js"

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

// Function to check if a string contains a number
const containsNumber = (str) => /\d+(\.\d+)?/.test(str);

// Extract function to identify total amount and other data from OCR results
function extract(data) {
  let totalAmount = null;
  let res = [];

  data.forEach((item) => {
    const text = item[0].toLowerCase();

    if (text.includes("total") && containsNumber(text)) {
      const numberMatch = text.match(/(\d+(\.\d+)?)/);
      if (numberMatch) {
        totalAmount = numberMatch[0];
      }
    } else {
      res.push(text);
    }
  });

  return {
    totalAmount,
    otherData: res,
  };
}

// Utility to get the latest file from the uploads directory
const getLatestFile = (dir) => {
  const files = fs.readdirSync(dir)
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(dir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); 
  return files.length ? files[0].name : null; 
};

// Utility to delete all files in the uploads directory
const clearUploadsFolder = async (dir) => {
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    await fs.promises.unlink(path.join(dir, file));
  }
};

// Upload file route
router.post("/", uploads.single("recipt"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.file.originalname);

    if (!fs.existsSync(path.join(__dirname, "uploads"))) {
      fs.mkdirSync(path.join(__dirname, "uploads"));
    }

    await fs.promises.writeFile(filePath, req.file.buffer);
    res.send({ message: "File uploaded successfully", filePath: filePath });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Bill processing route
router.get("/bill", async (req, res) => {
  const { email_id } = req.query;

  try {
    const url = "https://yolo12138-paddle-ocr-api.hf.space/ocr?lang=ch"; // Replace with your OCR API
    const uploadsDir = path.join(__dirname, "uploads");

    // Get the latest uploaded file
    const latestFile = getLatestFile(uploadsDir);
    if (!latestFile) {
      return res.status(404).send({ error: "No files found in uploads directory" });
    }

    const filePath = path.join(uploadsDir, latestFile);

    // Prepare the form data for the OCR request
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath), {
      filename: latestFile,
      contentType: "image/png",  // Adjust the content type based on the uploaded file
    });

    // Send the OCR request to the external API
    const ocrResponse = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Accept: "application/json",
      },
    });

    const result = ocrResponse.data;
    let data = [];
    let fullText = [];

    // Iterate through the OCR results
    result.forEach((item) => {
      const box = item.boxes[0];
      const x = box[0];
      const y = box[1];

      data.push([item.txt, [x, y]]);
      fullText.push(item.txt);
    });

    const { totalAmount, otherData } = extract(data);
    const fullTextString = fullText.join(" ");

    // Generate category, description, and amount using Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
          Go through the following text and generate a category, description, and amount:\n
          ${fullTextString} give in json form like {'category':'', 'desc':'', amount:''}. it should be a valid json . no other text except for the json data no backticks nothing..
        `;

    const resu = await model.generateContent(prompt);

    // const generatedText = aiResponse?.choices?.[0]?.text || "";
    const jsonResponse = JSON.parse(resu.response.text());

    res.status(200).json({
      message: "OCR processed successfully",
      totalAmount,
      otherData,
      fullText: fullTextString,
      generatedDetails: jsonResponse,
    });
    const user = await User.findOne({email_id});
    if (!user) {
      return res.status(404).json({ success:false,message: 'User with the provided email ID not found' });
    }
    const transactionData = new Transaction({
        category: jsonResponse.category,
        description: jsonResponse.desc,
        amount: jsonResponse.amount,
        date: Date.now(),
    })
    await transactionData.save()
    user.transactions.push(transactionData);
    await user.save();


    // Clear the uploads folder after processing
    await clearUploadsFolder(uploadsDir);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: error.message });
  }
});

export default router;
