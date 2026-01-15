const mongoose = require("mongoose");

const shopLoginSchema = new mongoose.Schema({
  shopNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "SHOP" },
  authorityId: { type: String, required: true }
});

module.exports = mongoose.model("ShopLogin", shopLoginSchema, "shopLogins");
