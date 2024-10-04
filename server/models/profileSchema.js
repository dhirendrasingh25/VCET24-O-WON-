import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    
    age: {
        type: Number,
        required: true,
    },
    occupation:{
        type: Number,
        required: true,
    },
    ailments: [
      {  name: String,
        amount:Number
    }],
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
    mandatoryExpenses: [
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
    loans : {
        type: Number,
        required: true,
    },
    emi:[{
        emi:String,
        amount:Number
    }]

}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
