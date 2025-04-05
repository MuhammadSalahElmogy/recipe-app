const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ جلب جميع المستخدمين (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // منع عرض الباسوورد
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ جلب مستخدم واحد حسب الـ ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.find({id:req.params.id}).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ تحديث بيانات المستخدم
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ حذف مستخدم
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
