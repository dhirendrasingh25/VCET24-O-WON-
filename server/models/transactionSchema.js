import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    id: String,
    email_id: {
        type: String, 
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Other'],
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
