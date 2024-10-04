import dotenv from 'dotenv';

import app from './app.js';
import dbConnect from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 4001;

const startServer = async () => {
    try {
        await dbConnect(); // Ensures DB connection happens before starting the server

        app.listen(PORT, () => {
            console.log((`Server is running on port ${PORT}`));
        });
    } catch (error) {
        console.error(`Error in starting the server: ${error}`);
        process.exit(1);
    }
};

startServer();
