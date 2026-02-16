// backend/model/shopTransaction.js
const mongoose = require("mongoose");

const shopTransactionSchema = new mongoose.Schema(
  {
    shopNo: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    items: [
      {
        stockId: { type: String, required: true },
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    allocatedBy: { type: String, default: "authority" }, // can store authorityId if needed
  },
  {
    collection: "shopTransaction",
    timestamps: true,
  }
);

module.exports = mongoose.model("shopTransaction", shopTransactionSchema);
