const mongoose = require("mongoose");

const UserStockSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    perMemberQty: { type: Number, default: 0 },
    perFamilyQty: { type: Number, default: 0 },
    unit: { type: String, required: true },
  },
  { collection: "userStock" }
);
console.log("User" ,{UserStockSchema})
module.exports = mongoose.model("userStock", UserStockSchema);
