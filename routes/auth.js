const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, age, gender, lookingFor } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashed = await bcrypt.hash(password, 10);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = new User({
            name,
            email,
            password: hashed,
            age,
            gender,
            lookingFor,
            verified: false,
            verificationToken
        });

        await user.save();

        // Send verification email
        const verifyUrl = `https://realbeforereveal.com/verify?token=${verificationToken}`;

        await resend.emails.send({
            from: "noreply@realbeforereveal.com",
            to: email,
            subject: "Verify your email",
            html: `
                <h2>Welcome, ${name}!</h2>
                <p>Click the link below to verify your email:</p>
                <a href="${verifyUrl}">Verify Email</a>
            `
        });

        res.json({ success: true, message: "Signup successful. Please verify your email." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }


        if (!user.verified) {
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        res.json({ success: true, userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// GET /auth/verify
router.get("/verify", async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send("Invalid verification link.");
        }

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).send("Invalid or expired verification token.");
        }

        user.verified = true;
        user.verificationToken = null;
        await user.save();

        res.send("Email verified successfully! You can now log in.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

// POST /auth/profile
router.post("/profile", async (req, res) => {
    try {
        const { displayName, dob, location, relationshipIntent, coreValues, funTags } = req.body;

        if (!displayName || !dob || !location) {
            return res.status(400).json({ error: "Missing required profile fields" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
