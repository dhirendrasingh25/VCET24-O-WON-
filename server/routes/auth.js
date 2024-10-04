import express from 'express';
import User from '../models/userSchema.js'


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email_id, image } = req.body;

        const existing = await User.findOne({email_id});
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({
            name, email_id, image
        });
        await newUser.save();
        res.status(201).json({ message:'User profile created' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding transaction', error });
    }
});

router.get('/check', async (req, res) => {
    try {
        const {email_id} = req.query.email_id;
        const user = await User.findOne({ email_id: email_id });

        res.status(200).json({ 
            success: user ? true : false, 
            complete_profile: user?.complete_profile 
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


export default router;
