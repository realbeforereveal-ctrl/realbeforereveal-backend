require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// ⭐ CORS — THIS IS THE FIX ⭐
const allowedOrigins = [
    "https://realbeforereveal.com",
    "https://www.realbeforereveal.com",
    "https://glistening-melomakarona-6831a0.netlify.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
];

app.use(cors({
    origin: function (origin, callback) {
        console.log("Origin:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("❌ Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// Required for OPTIONS preflight
app.options("*", cors());

// JSON body parsing
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));

// Health check
app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port " + PORT));
