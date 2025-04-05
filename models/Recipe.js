const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  id:Number,
  name: String,
  category: String,
  image: String,
  price: Number,
  offerPrice: Number,
  time: String,
  rate: String,
  chef_id: Number,
  video_link: String,
  ingredients: Array,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
