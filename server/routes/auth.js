import express from "express";
import User from "../models/userSchema.js";

const router = express.Router();

router.post("/received", async (req, res) => {
    try {
        const { email_id, formData } = req.body;

        if (!email_id || !formData) {
            return res.status(400).json({
                success: false,
                message: "Email ID  and formData is required",
            });
        }

        const user = await User.findOne({ email_id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with the provided email ID not found",
            });
        }

        const newProfile = new Profile({
            ...formData,
        });

        const savedProfile = await newProfile.save();

        user.profile = savedProfile._id;
        user.complete_profile = true;

        await user.save();

        res.json({
            sucess: true,
            message: "Profile updated successfully",
            user,
            savedProfile,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, email_id, image } = req.body;

        const existing = await User.findOne({ email_id });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({
            name,
            email_id,
            image,
        });
        await newUser.save();
        res.status(201).json({ message: "User profile created" });
    } catch (error) {
        res.status(500).json({ message: "Error adding transaction", error });
    }
});

router.get("/check", async (req, res) => {
    try {
        const { email_id, name, image } = req.query;
        let user = await User.findOne({ email_id: email_id });
        if (!user) {
            user = await User.create({
                name,
                email_id,
                image,
            });
            await user.save();
        }

        res.status(200).json({
            success: user ? true : false,
            user: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

export default router;
