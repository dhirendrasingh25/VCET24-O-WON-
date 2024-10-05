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
import messagesRoutes from "./routes/messages.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Messages from "./models/messagesSchema.js";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import dotenv from "dotenv";
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

// Plaid API configuration
const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": "66fecc4237a1ca001ab69530",
            "PLAID-SECRET": "3a62eac09d03b7c2a6a596f8fa7f20",
        },
    },
});

const plaidClient = new PlaidApi(configuration);

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

// Plaid API routes
app.post("/create_link_token", async (req, res) => {
    const plaidRequest = {
        user: {
            client_user_id: "66fecc4237a1ca001ab69530",
        },
        client_name: "Your App Name",
        products: ["auth"],
        language: "en",
        redirect_uri: "https://localhost:3000",
        country_codes: ["US"],
    };

    try {
        const createTokenResponse =
            await plaidClient.linkTokenCreate(plaidRequest);
        res.json(createTokenResponse.data);
    } catch (error) {
        console.error("Error creating link token:", error);
        res.status(500).json({
            error: "Failed to create link token",
            details: error.message,
        });
    }
});

app.post("/auth", async (req, res) => {
    try {
        const access_token = req.body.access_token;
        const plaidRequest = { access_token };
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        res.json(plaidResponse.data);
    } catch (e) {
        res.status(500).send("failed");
    }
});

app.post("/exchange_public_token", async (req, res) => {
    const publicToken = req.body.public_token;
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const accessToken = plaidResponse.data.access_token;
        res.json({ accessToken });
    } catch (error) {
        res.status(500).send("failed");
    }
});

// Socket.io events
io.on("connection", (socket) => {
    console.log("User Connected ID : ", socket.id);

    socket.on("message", async (data) => {
        console.log("Message Received : ", data);
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

// Database connection and server startup
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
