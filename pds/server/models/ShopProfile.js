const mongoose = require("mongoose");

const shopProfileSchema = new mongoose.Schema({
  shopNo: { type: String, required: true, unique: true },
  shopName: { type: String, required: true },
  shopOwnerName: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true }
});

module.exports = mongoose.model("ShopProfile", shopProfileSchema, "shopProfiles");
