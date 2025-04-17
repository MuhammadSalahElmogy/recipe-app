const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chef = require("../models/Chef");
const router = express.Router();
const nodemailer = require("nodemailer"); // npm install nodemailer
const crypto = require("crypto");

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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token, user });
});

// طلب رابط إعادة تعيين كلمة المرور
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Email not found" });

  // إنشاء token عشوائي
  const token = crypto.randomBytes(32).toString("hex");

  // حفظ التوكن وتاريخ انتهاءه (ساعة واحدة مثلاً)
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // إعداد الإيميل
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const resetURL = `http://localhost:5000/reset-password/${token}`; // حط هنا لينك صفحة الreset password اللي عملتها في الفرونت

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset",
    text: `Click this link to reset your password: ${resetURL}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error while sending email:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }
    res.json({ message: "Password reset email sent" });
  });
});

// إعادة تعيين كلمة المرور
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ error: "Invalid or expired reset token" });

  // تحديث كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password has been reset successfully" });
});

module.exports = router;
