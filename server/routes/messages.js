import express from "express";

const router = express.Router();
import Chat from "../models/messagesSchema.js";

router.get("/getChats", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
export default router;
