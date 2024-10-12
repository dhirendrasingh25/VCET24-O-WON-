import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dwollaCustomerId: {
        type: String,
    },
    dwollaCustomerUrl: {
        type: String,
    },
    email_id: {
        type: String,
        required: true,
    },
    image: String,
    complete_profile: {
        type: Boolean,
        default: false,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },
    ],
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    bankAccounts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BankAccount",
        },
    ],
});

const User = mongoose.model("User", userSchema);

export default User;
