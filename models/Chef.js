const mongoose = require("mongoose");

const ChefSchema = new mongoose.Schema({
  id:Number,
  name: String,
  email: { type: String, unique: true },
  password: String,
  recipes: Array,
  image: String,
  kitchen: String,
  address: String,
  description: String,
  rate: Number,
  reviews: Array,
});

module.exports = mongoose.model("Chef", ChefSchema);
