import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true,
    },
    ailments: {
        type: String,
        required: true,
    },
    lifestyle: {
        type: String,
        required: true,
    },
    dependents: {
        type: Number,
        required: true,
    },
    dependantDescription: {
        type: String,
        required: false,
    },
    goal: {
        type: String,
        required: true,
    },
    expenses: [
        {
            description: String,
            amount: Number
        }
    ],
    currentInvestments: [
        {
            type: String,
            required: true,
        }
    ],
    duration: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
