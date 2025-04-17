const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// ✅ جلب جميع الوصفات
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("chef_id", "name");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ جلب وصفة واحدة حسب الـ ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.find({ id: req.params.id }).populate(
      "chef_id",
      "name"
    );
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ إضافة وصفة جديدة
// router.post("/", async (req, res) => {
//   try {
//     const newRecipe = new Recipe(req.body);
//     await newRecipe.save();
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     res.status(400).json({ error: "Invalid data" });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ تعديل وصفة
router.put("/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRecipe)
      return res.status(404).json({ error: "Recipe not found" });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ حذف وصفة
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe)
      return res.status(404).json({ error: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
