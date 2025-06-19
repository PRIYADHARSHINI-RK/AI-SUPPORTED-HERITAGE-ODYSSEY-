const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendNotificationEmail = require("./utils/mailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/heritageExplorer", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email: normalizedEmail, password: hashedPassword });

        await newUser.save();

        // Send Welcome Email
       try {
    await sendNotificationEmail(
        email,
        "Welcome to Heritage Odyssey!",
        `Dear ${name},

Welcome to Heritage Odyssey – your personalized guide to Tamil Nadu’s rich heritage and culture!

We’re thrilled to have you on board. 🎉

From historic temples and ancient cities to vibrant festivals and traditional cuisines, there’s so much to explore. We'll also keep you informed about any special events, festivals, or cultural highlights that you wouldn’t want to miss.

Stay tuned – your journey into the heart of Tamil Nadu begins now!

Warm regards,  
The Heritage Odyssey Team`
    );
} catch (err) {
    console.error("Email sending failed:", err);
}


        const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ msg: "Signup successful", token, name: newUser.name });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ msg: "Server error during signup" });
    }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ msg: "Login successful", token, name: user.name });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Server error during login" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
