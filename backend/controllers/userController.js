// controllers/authController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import { sendWelcomeEmail, sendNotificationEmail } from "../services/emailServices.js";

// —— your old code, unchanged ——

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const token = createToken(user._id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        //check if user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// —— new endpoints from your “new code” ——

// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Store token & expiry in user document
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send password reset email
        await sendNotificationEmail(
            email,
            user.name,
            'password_reset',
            { resetLink }
        );

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error in password reset request:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        // assumes you have an auth middleware that sets req.user.id
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    loginUser,
    registerUser,
    requestPasswordReset,
    getProfile
};
