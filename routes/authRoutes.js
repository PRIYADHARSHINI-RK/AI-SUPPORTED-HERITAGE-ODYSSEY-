// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // ← Bring in model
const bcrypt = require("bcryptjs");

// 🔐 Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user 👇👇👇
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ msg: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid password" });
      }
  
      // Optional: Generate JWT if you want secure sessions
      // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({
        msg: "Login successful!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
        // token
      });
  
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ msg: "Internal server error" });
    }
  });
  

module.exports = router;

