import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import InvestmentRoute from './routes/investments.js';
import OcrRoute from './routes/ocr.js';
import transactionRoutes from './routes/transactions.js';
import authRoute from './routes/auth.js';
import userSchema from "./models/userSchema.js"

const app = express();

const corsOptions = {};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));

app.use("/plan", InvestmentRoute);
app.use("/ocr", OcrRoute);
app.use("/auth", authRoute)

app.get('/check', async (req, res) => {
    const { email_id } = req.query;
    if (!email_id) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const user = await userSchema.findOne({ email_id: email_id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ complete_profile: user.complete_profile });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.use('/api', transactionRoutes);

export default app;
