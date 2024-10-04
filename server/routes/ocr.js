import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  });
const uploads = multer({
  dest: "uploads",
  storage: storage,
});

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

router.post("/", uploads.single("recipt"), async (req, res) => {
  try {
    const pathToFile = "uploads/recipt.jpeg";
    await fs.promises.writeFile("uploads/recipt.jpeg", req.file.buffer);
    const data = process(pathToFile);
    res.send("uploaded");
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/bill", (req, res, next) => {
  try {
    const url = "https://yolo12138-paddle-ocr-api.hf.space/ocr?lang=ch";
    const filePath = path.join(__dirname, "uploads", "recipt1.png");
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath), {
      filename: "recipt1.png",
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

        console.log("Result:", extract(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
