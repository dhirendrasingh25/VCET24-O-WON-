import mongoose from 'mongoose';
import transactionSchema from './transactionSchema.js'
import quizSchema from './quizSchema.js'
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email_id:{
        type: String,
        required:true
    },
    image:String,
    complete_profile:{
        type: Boolean,
        default: false
    },
    transactions: transactionSchema,
    quiz: quizSchema
});

const User = mongoose.model('User', userSchema);

export default User;
