const mongoose = require("mongoose");

const shopLoginSchema = new mongoose.Schema(
  {
    shopNo: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // 🔥 needed for profile UI
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "shopkeeper" },
    authorityId: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ShopLogin ||
  mongoose.model("ShopLogin", shopLoginSchema, "shopLogins");
