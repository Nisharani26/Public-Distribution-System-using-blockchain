const mongoose = require("mongoose");

const ShopStockSchema = new mongoose.Schema(
  {
    shopNo: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    items: [
      {
        stockId: { type: String, required: true },
        itemName: { type: String, required: true },
        allocatedQty: { type: Number, default: 0 },
        availableQty: { type: Number, default: 0 },
      },
    ],
  },
  {
    collection: "shopStock",
    timestamps: true,
  }
);

module.exports = mongoose.model("shopStock", ShopStockSchema);
