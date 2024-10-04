import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import transactionRoutes from './routes/transactions.js'; // Correct the path as needed

const app = express();

const corsOptions = {}; // Define your CORS options here, if needed

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));

// Basic route for health check
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Transaction routes
app.use('/api', transactionRoutes);

export default app;
