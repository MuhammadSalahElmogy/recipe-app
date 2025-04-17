const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RecipeSchema = new mongoose.Schema({
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

RecipeSchema.plugin(AutoIncrement, { inc_field: "id" }); // هنا يتم تفعيل الزيادة التلقائية للـ id

module.exports = mongoose.model("Recipe", RecipeSchema);
