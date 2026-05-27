const express = require("express");
const router = express.Router();

// In-memory user store (works on Render)
let users = [];

// ⭐ SIGNUP ⭐
router.post("/signup", (req, res) => {
    const { name, email, password, age, gender, lookingFor } = req.body;

    if (!name || !email || !password) {
        return res.json({ error: "Missing required fields" });
    }

    // Check if email exists
    if (users.some(u => u.email === email)) {
        return res.json({ error: "Email already registered" });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        age,
        gender,
        lookingFor
    };

    users.push(newUser);

    res.json({ success: true });
});

// ⭐ LOGIN ⭐
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.json({ error: "Invalid email or password" });
    }

    res.json({
        success: true,
        userId: user.id,
        name: user.name,
        email: user.email
    });
});

// ⭐ GET PROFILE ⭐
router.get("/profile/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.json({ error: "User not found" });
    }

    res.json(user);
});

// ⭐ DELETE USER ⭐
router.delete("/delete/:id", (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.json({ success: true });
});

module.exports = router;
