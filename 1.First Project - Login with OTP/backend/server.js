// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js"; // ensure correct path

dotenv.config();
const app = express();

// =======================
// 🧩 Middleware
// =======================
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// =======================
// ⚙️ MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =======================
// 🌐 Routes
// =======================

// Root Test Route
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running successfully with MongoDB" });
});

// --------------------
// 🧑‍💻 Signup Route
// --------------------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, gender, age, twoFA } =
      req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      gender,
      age: age ? new Date(age) : null,
      twoFA: twoFA || { enabled: false },
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --------------------
// 🔐 Login Route
// --------------------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT (optional for frontend)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    // Check if 2FA is enabled
    if (user.twoFA?.enabled) {
      const tempToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "5m" }
      );

      return res.json({
        message: "2FA verification required",
        twoFA: user.twoFA,
        tempToken,
      });
    }

    // No 2FA → direct login success
    res.json({
      message: "Login successful",
      token,
      user: { email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =======================
// 🚀 Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
