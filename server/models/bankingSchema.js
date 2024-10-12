import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        bankId: {
            type: String,
            required: true,
        },
        accountId: {
            type: String,
            required: true,
        },
        accessToken: {
            type: String,
            required: true,
        },
        fundingSourceUrl: {
            type: String,
            required: true,
        },
        shareableId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);
export default BankAccount;
