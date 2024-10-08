import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        dob: {
            type: Date,
            required: true,
        },
        occupation: {
            type: String,
            required: true,
        },
        ailments: {
            type: Number,
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
        mandatoryExpenses: {
            type: Number,
            required: true,
        },
        currentInvestments: [
            {
                investType: {
                    type: String,
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
            },
        ],
        duration: {
            type: String,
            required: true,
        },
        monthlyIncome: {
            type: Number,
            require: true,
        },
        loans: {
            type: Number,
            required: true,
        },
        emi: {
            type: Number,
            required: true,
        },
        savings: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
