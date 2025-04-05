const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id:Number,
  name: String,
  slug: String,
  image: String,
});

module.exports = mongoose.model("Category", CategorySchema);
