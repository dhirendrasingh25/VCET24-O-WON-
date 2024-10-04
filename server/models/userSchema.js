import mongoose from 'mongoose';

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
});

const User = mongoose.model('User', userSchema);

export default User;
