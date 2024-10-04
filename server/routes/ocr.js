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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

const threshold = 5;

function extract(data) {
  let totCoord = [];
  let dateCoord = [];
  let res = [];

  data.forEach((item) => {
    if (item[0].toLowerCase() === "total") {
      totCoord = item[1];
    }
    if (item[0].toLowerCase() === "date:") {
      dateCoord = item[1];
    }
  });

  if (!totCoord.length) {
    return null;
  }

  data.forEach((item) => {
    const deltaY = Math.abs(item[1][1] - totCoord[1]);
    if (item[0].toLowerCase() !== "total" && deltaY < threshold) {
      res.push(item[0]);
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
  try {
    const url = "https://yolo12138-paddle-ocr-api.hf.space/ocr?lang=ch";
    const uploadsDir = path.join(__dirname, "uploads");

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

    axios
      .post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          Accept: "application/json",
        },
      })
      .then(async (response) => {
        const result = response.data;
        let data = [];

        result.forEach((item) => {
          const box = item.boxes[0];
          const x = box[0];
          const y = box[1];
          data.push([item.txt, [x, y]]);
        });

        const extractedData = extract(data);
        res.send({ extractedData });


        await clearUploadsFolder(uploadsDir);
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
