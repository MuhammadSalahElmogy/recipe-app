const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  id:Number,
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("Admin", AdminSchema);
