import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import InvestmentRoute from './routes/investments.js';
import OcrRoute from './routes/ocr.js';
import transactionRoutes from './routes/transactions.js';
import quizRoutes from './routes/quiz.js';
import authRoute from './routes/auth.js';
import analysisRoute from './routes/analysis.js'
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
app.use("/analysis", analysisRoute);


app.use('/api', transactionRoutes);
app.use('/quiz',quizRoutes)

app.get('/', (req, res) => {    
    res.send('Hello World');
})

export default app;
