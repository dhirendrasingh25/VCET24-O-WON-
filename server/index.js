import app from './app.js';

const PORT = process.env.PORT || 4001;

app.listen(PORT, (error) => {
    if(error) {
        console.log(error);
        process.exit(1);
    }

    console.log(`Server is running on port ${PORT}`);
});
