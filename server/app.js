import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {}; // Define your CORS options here, if needed

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app;
