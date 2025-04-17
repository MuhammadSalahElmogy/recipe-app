const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipes: [
    {
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "preparing", "delivered"],
    default: "pending",
  },
  paymentMethod: { type: String, enum: ["cash", "card"], default: "cash" },
  address: String,
  phone: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

// إضافة الزيادة التلقائية للـ ID
// OrderSchema.plugin(AutoIncrement, { inc_field: "id" });
OrderSchema.plugin(AutoIncrement, { inc_field: "id", id: "order_seq" });

module.exports = mongoose.model("Order", OrderSchema);
