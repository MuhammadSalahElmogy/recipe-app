const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id:Number,
  name: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  favorites: Array,
  orders: Array,
});

module.exports = mongoose.model("User", UserSchema);
