import express from 'express';
import User from '../models/userSchema.js'


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email_id, image } = req.body;

        const existing = await User.findOne({email_id});
        if (existing) {
            return res.status(400).json({success: false, message: 'User already exists' });
        }
        const newUser = new User({
            name, email_id, image
        });
        await newUser.save();
        res.status(201).json({success:true, message:'User profile created' });
    } catch (error) {
        res.status(500).json({success:false, message: 'Error adding transaction', error });
    }
});

router.get('/check', async (req, res) => {
    try {
        const {email_id, name, image} = req.query;
        let user = await User.findOne({ email_id: email_id });
        if(!user){
            user = await User.create({
                name, email_id, image
            })
            await user.save();
        }
        
        res.status(200).json({ 
            success: user ? true : false, 
            user: user 
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


export default router;
