import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
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
import { createServer } from "http";
import { Server } from "socket.io";
import messagesRoutes from "./routes/messages.js";

const app = express();
export const server = new createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

const corsOptions = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

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

import Messages from "./models/messagesSchema.js";

io.on("connection", (socket) => {
    console.log("User Connected ID : ", socket.id);

    socket.on("message", async (data) => {
        console.log("Message Recieved : ", data);
        try {
            const newMessage = new Messages({
                sender: data.sender,
                message: data.message,
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

app.get("/", (req, res) => {
    res.send("Hello World");
});

import dotenv from "dotenv";

import dbConnect from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 4001;

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
