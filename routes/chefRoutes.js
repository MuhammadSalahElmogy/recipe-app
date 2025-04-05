const express = require("express");
const router = express.Router();
const Chef = require("../models/Chef");

// ✅ جلب شيف واحد حسب الـ ID
router.get("/:id", async (req, res) => {
  try {
    const chef = await Chef.find({id:req.params.id});
    if (!chef) return res.status(404).json({ error: "Chef not found" });
    res.json(chef);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//✅ جلب جميع الشيفات
router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});



// ✅ إضافة شيف جديد
router.post("/", async (req, res) => {
  try {
    const newChef = new Chef(req.body);
    await newChef.save();
    res.status(201).json(newChef);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ تعديل بيانات شيف
router.put("/:id", async (req, res) => {
  try {
    const updatedChef = await Chef.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedChef) return res.status(404).json({ error: "Chef not found" });
    res.json(updatedChef);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ حذف شيف
router.delete("/:id", async (req, res) => {
  try {
    const deletedChef = await Chef.findByIdAndDelete(req.params.id);
    if (!deletedChef) return res.status(404).json({ error: "Chef not found" });
    res.json({ message: "Chef deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
