const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/authMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/", authMiddleware, async (req, res) => {
  const { recipes, totalPrice, paymentMethod, address, phone, notes } = req.body;

  try {
    if (paymentMethod === "cash") {
      const order = new Order({
        userId: req.user.id,
        recipes,
        totalPrice,
        paymentMethod,
        address,
        phone,
        notes,
      });
      await order.save();
      return res.status(201).json(order);
    }

    if (paymentMethod === "card") {
      // 1. Get recipe IDs
      const recipeIds = recipes.map(r => r.recipeId);

      // 2. Fetch recipe details from DB
      const recipeDocs = await Recipe.find({ _id: { $in: recipeIds } });

      // 3. Build line_items with recipe names
      const line_items = recipes.map(item => {
        const recipe = recipeDocs.find(r => r._id.toString() === item.recipeId);
        return {
          price_data: {
            currency: "EGP",
            product_data: {
              name: recipe ? recipe.name : "Recipe",
            },
            unit_amount: (recipe?.offerPrice || recipe?.price || 0) * 100,
          },
          quantity: item.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: "http://localhost:3000/payment-success",
        cancel_url: "http://localhost:3000/payment-cancelled",
        metadata: {
          userId: req.user.id,
          address,
          phone,
          notes,
        },
      });

      return res.status(200).json({ url: session.url });
    }

    res.status(400).json({ error: "Invalid payment method" });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ جلب جميع الطلبات (للأدمن مثلاً)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("recipes.recipeId", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ جلب الطلبات الخاصة بمستخدم معين
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate(
      "recipes.recipeId",
      "name price"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ تحديث حالة الطلب
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ حذف طلب
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
