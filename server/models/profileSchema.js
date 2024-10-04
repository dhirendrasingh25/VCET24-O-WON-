import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    age: {
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
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ]
    ,
    duration: {
        type: String,
        required: true,
    },
    monthly_income: {
        type: Number,
        require: true
    }
    ,
    loans: {
        type: Number,
        required: true,
    },
    emi:
        {
                type: Number,
                required: true, 
        }
    
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
