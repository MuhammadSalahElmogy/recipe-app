const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chef = require("../models/Chef");
const router = express.Router();
const nodemailer = require("nodemailer"); // npm install nodemailer

// تسجيل المستخدم
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, phone });

  try {
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تسجيل الدخول
// role needed (radio box user, chef) from front end to back end
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token, user });
});

module.exports = router;
