const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  favorites: Array,
  orders: Array,
  
  // إضافة الحقول الخاصة بإعادة تعيين كلمة المرور
  resetPasswordToken: String,  // التوكن اللي هيتولد عند طلب إعادة تعيين كلمة المرور
  resetPasswordExpires: Date,  // تاريخ انتهاء صلاحية التوكن
});

module.exports = mongoose.model("User", UserSchema);

