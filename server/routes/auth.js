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

export default router;
