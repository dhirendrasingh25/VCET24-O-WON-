import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import InvestmentRoute from './routes/investments.js';
import OcrRoute from './routes/ocr.js';

const app = express();

// Define CORS options here, if needed
const corsOptions = {};

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
app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app;
