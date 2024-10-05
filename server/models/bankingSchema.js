import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bankId: { type: String, required: true },
    accountId: { type: String, required: true },
    accessToken: { type: String, required: true },
    fundingSourceUrl: { type: String, required: true },
    shareableId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
