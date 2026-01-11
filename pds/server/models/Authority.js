const mongoose = require("mongoose");

const authoritySchema = new mongoose.Schema({
  authorityId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  designation: { type: String },
  role: { type: String, default: "authority" }
});

module.exports = mongoose.model("Authority", authoritySchema);
