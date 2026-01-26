const mongoose = require("mongoose");

const UserStockSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    perMemberQty: { type: Number, default: 0 },
    perFamilyQty: { type: Number, default: 0 },
    unit: { type: String, required: true },
  },
  {
    collection: "userStock", // matches your MongoDB collection
    timestamps: true,
  }
);

// IMPORTANT: Export the model directly
module.exports = mongoose.model("userStock", UserStockSchema);
