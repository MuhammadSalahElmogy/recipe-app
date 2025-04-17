const express = require("express");
const Cart = require("../models/Cart");
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ إنشاء سلة تسوق جديدة للمستخدم
router.post("/", authMiddleware, async (req, res) => {
  const cart = new Cart({
    userId: req.user.id,
    items: [],
  });

  try {
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ جلب سلة التسوق الخاصة بالمستخدم
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.recipeId", "name price");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ إضافة وصفة إلى سلة التسوق
router.post("/add", authMiddleware, async (req, res) => {
  const { recipeId, quantity } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // Check if recipe already exists in the cart, if yes, update the quantity
    const itemIndex = cart.items.findIndex((item) => item.recipeId.toString() === recipeId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ recipeId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ إزالة وصفة من سلة التسوق
router.delete("/remove/:recipeId", authMiddleware, async (req, res) => {
  const { recipeId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.recipeId.toString() === recipeId);
    if (itemIndex >= 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ error: "Recipe not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ مسح سلة التسوق بالكامل
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
