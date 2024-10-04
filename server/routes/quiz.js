import express from 'express';
import Quiz from '../models/quizSchema.js'; // Ensure you have `.js` at the end for ES6 module imports

const router = express.Router();

// GET route to fetch quiz data by ID
router.get('/quiz/:id', async (req, res) => {
    try {
        const quizData = await Quiz.findById(req.params.id);  // Using req.params.id to query the database
        if (!quizData) {
            return res.status(404).json({ message: 'Quiz data not found' });
        }
        res.json(quizData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new quiz entry
router.post('/', async (req, res) => {
    const { age, ailments, lifestyle, dependents, dependantDescription, goal, expenses, currentInvestments, duration, review } = req.body;

    const quizData = new Quiz({
        age,
        ailments,
        lifestyle,
        dependents,
        dependantDescription,
        goal,
        expenses,
        currentInvestments,
        duration,
        review
    });

    try {
        const newQuizData = await quizData.save();
        res.status(201).json(newQuizData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
