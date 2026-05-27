const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB



mongoose.connect("mongodb+srv://realbeforereveal_db_user:RevealB4Realnogood@cluster0.6fndbu3.mongodb.net/realbefore?authSource=admin");

// Routes
app.use("/auth", require("./routes/auth"));

app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(5000, () => console.log("Backend server running on port 5000"));



mongoose.connect("mongodb+srv://realbeforereveal_db_user:RevealB4Realnogood@cluster0.6fndbu3.mongodb.net/realbefore?authSource=admin");