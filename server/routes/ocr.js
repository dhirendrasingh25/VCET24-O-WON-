import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import FormData from "form-data";

const router = express.Router();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

const threshold = 5;

function extract(data) {
  let totCoord = [];
  let dateCoord = [];
  let res = [];

  // Find the coordinates for 'Total' and 'Date'
  data.forEach((item) => {
    if (item[0].toLowerCase() === "total") {
      totCoord = item[1];
    }
    if (item[0].toLowerCase() === "date:") {
      dateCoord = item[1];
    }
  });

  // Check if 'Total' was found
  if (!totCoord.length) {
    return null;
  }

  // Check for items near 'Total' and 'Date'
  data.forEach((item) => {
    if (item[0].toLowerCase() !== "total") {
      const deltaY = Math.abs(item[1][1] - totCoord[1]);
      if (deltaY < threshold) {
        res.push(item[0]);
      }
    }
    if (dateCoord.length && item[0].toLowerCase() !== "date:") {
      const deltaY = Math.abs(item[1][1] - dateCoord[1]);
      if (deltaY < threshold) {
        res.push(item[0]);
      }
    }
  });

  return res;
}

// Route to upload the receipt file
router.post("/", uploads.single("recipt"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.file.originalname);

    // Ensure the 'uploads' directory exists
    if (!fs.existsSync(path.join(__dirname, "uploads"))) {
      fs.mkdirSync(path.join(__dirname, "uploads"));
    }

    // Write the file buffer to the 'uploads' directory
    await fs.promises.writeFile(filePath, req.file.buffer);

    res.send({ message: "File uploaded successfully", filePath: filePath });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Function to get the latest file in the uploads directory
const getLatestFile = (dir) => {
  const files = fs.readdirSync(dir)
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(dir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); // Sort by modified time in descending order
  return files.length ? files[0].name : null; // Return the latest file name
};

// Route to send the latest uploaded file for OCR processing
router.get("/bill", (req, res, next) => {
  try {
    const url = "https://yolo12138-paddle-ocr-api.hf.space/ocr?lang=ch";
    const uploadsDir = path.join(__dirname, "uploads");

    // Get the latest file in the uploads directory
    const latestFile = getLatestFile(uploadsDir);
    if (!latestFile) {
      return res.status(404).send({ error: "No files found in uploads directory" });
    }

    const filePath = path.join(uploadsDir, latestFile);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath), {
      filename: latestFile,
      contentType: "image/png",
    });

    // Send the OCR request
    axios
      .post(url, formData, {
        headers: {
          ...formData.getHeaders(), // Include form data headers
          Accept: "application/json",
        },
      })
      .then((response) => {
        const result = response.data;
        let data = [];

        // Extract the relevant data from OCR response
        result.forEach((item) => {
          const box = item.boxes[0]; // Get the first box coordinates
          const x = box[0];
          const y = box[1];
          data.push([item.txt, [x, y]]);
        });

        const extractedData = extract(data);
        res.send({ extractedData });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).send({ error: error.message });
      });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
