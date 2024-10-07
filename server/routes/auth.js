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
            success: true,
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
        let user = await User.findOne({ email_id });
        
        if (!user) {
            user = await User.create({
                name,
                email_id,
                image,
            });
            await user.save();

            return res
                .status(200)
                .json({ success: true, existing_user: false, user: user });
        }

        res.status(200).json({
            success: true,
            existing_user: true,
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

router.post("/update-dwolla-customer-id", async (req, res, next) => {
    try {
        const { email_id, dwollaCustomerId } = req.body;

        const user = await User.findOneAndUpdate(
            { email_id },
            { $set: { dwollaCustomerId } },
            { new: true },
        );

        // If user is not found
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        // Return success and the updated user data
        return res
            .status(200)
            .json({
                success: true,
                message: "User updated successfully.",
                user,
            });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
