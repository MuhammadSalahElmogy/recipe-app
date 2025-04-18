const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const Admin = require('../models/Admin');
const blacklistedTokens = require("../middleware/blacklistedTokens");

const router = express.Router();


router.post("/login", async (req, res) => {
  try {
  //return res.json({ req: req.body.email });
  const email = req.body.email;
  const user = await Admin.findOne({ email: email });
  //return res.json({ req: user.password });

    if (!user) return res.status(400).json({ error: "Invalid email" });

    if (req.body.password !== user.password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



router.post('/logout',authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    blacklistedTokens.add(token); // أضف التوكن إلى القائمة السوداء
    return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
  }

  res.status(400).json({ message: 'لم يتم إرسال توكن' });
});



module.exports = router;
