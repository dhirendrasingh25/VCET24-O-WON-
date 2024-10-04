import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import InvestmentRoute from './routes/investments.js';
import OcrRoute from './routes/ocr.js';
import transactionRoutes from './routes/transactions.js'; 
import quizRoutes from './routes/quiz.js';

const app = express();

// Define CORS options here, if needed
const corsOptions = {};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));

// Use the investment route
app.use("/plan", InvestmentRoute);
app.use("/ocr", OcrRoute)

// Basic route
// Basic route for health check
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Transaction routes
app.use('/api', transactionRoutes);
app.use('/quiz',quizRoutes)

export default app;
