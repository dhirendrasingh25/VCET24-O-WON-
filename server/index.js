import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";

import InvestmentRoute from "./routes/investments.js";
import OcrRoute from "./routes/ocr.js";
import transactionRoutes from "./routes/transactions.js";
import profileRoutes from "./routes/profile.js";
import authRoute from "./routes/auth.js";
import analysisRoute from "./routes/analysis.js";
import news from "./routes/news.js";
import tipsRoute from "./routes/tips.js";
import expenseRoute from "./routes/expense.js";
import messagesRoutes from "./routes/messages.js";

import Messages from "./models/messagesSchema.js";
import dbConnect from "./config/database.js";

dotenv.config();

const app = express();
export const server = new createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

// CORS options
const corsOptions = {};

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

// Route handlers
app.use("/plan", InvestmentRoute);
app.use("/ocr", OcrRoute);
app.use("/auth", authRoute);
app.use("/analysis", analysisRoute);
app.use("/tips-news", tipsRoute);
app.use("/expense", expenseRoute);
app.use("/api", transactionRoutes);
app.use("/profile/complete", profileRoutes);
app.use("/news", news);
app.use("/", messagesRoutes);

// Socket.io events
io.on("connection", (socket) => {
    console.log("User Connected ID : ", socket.id);

    socket.on("message", async (data) => {
        console.log("Message Received : ", data);
        try {
            const newMessage = new Messages({
                sender: data.sender,
                message: data.message,
                avatar: data.avatar,
                timestamp: data.timestamp,
            });
            await newMessage.save();
            io.emit("recieve-message", data);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected : ", socket.id);
    });
});

// Database connection and server startup
const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
    res.send("Hello World");
});

const startServer = async () => {
    try {
        await dbConnect();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error in starting the server: ${error}`);
        process.exit(1);
    }
};

startServer();
