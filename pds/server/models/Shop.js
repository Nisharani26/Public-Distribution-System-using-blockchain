const mongoose = require("mongoose");

const ShopkeeperLoginSchema = new mongoose.Schema({
  shopNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "SHOP" },
  authorityId: { type: String, required: true },
});

const ShopkeeperProfileSchema = new mongoose.Schema({
  shopNo: { type: String, required: true, unique: true },
  shopName: { type: String, required: true },
  shopOwnerName: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
});

// Export models with proper names (same style as Citizen)
const ShopkeeperLogin = mongoose.model(
  "ShopkeeperLogin",
  ShopkeeperLoginSchema,
  "shopLogins"
);

const ShopkeeperProfile = mongoose.model(
  "ShopkeeperProfile",
  ShopkeeperProfileSchema,
  "shopProfiles"
);

module.exports = { ShopkeeperLogin, ShopkeeperProfile };