const express = require("express");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// إنشاء تصنيف
router.post("/", authMiddleware, async (req, res) => {
  const category = new Category(req.body);
  try {
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id?", async (req, res) => {
  // If 'id' is present in the request params, fetch a specific category by ID
  if (req.params.id) {
    try {
      const category = await Category.find({id:req.params.id});
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
  
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid ID format" });
    }
  } 
  // Otherwise, fetch all categories
  else {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }
});

// جلب جميع التصنيفات
 router.get("/", async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
 }); 

 




// تعديل تصنيف
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// حذف تصنيف
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
