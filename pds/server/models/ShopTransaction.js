const mongoose = require("mongoose");

const ShopTransactionSchema = new mongoose.Schema({
  authorityId: { type: String, required: true },
  shopNo: { type: String, required: true },
  items: [
    {
      stockId: { type: String, required: true },
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  transactionDate: { type: Date, default: Date.now },
});

const ShopTransaction = mongoose.model("ShopTransaction", ShopTransactionSchema, "shopTransactions");

module.exports = ShopTransaction;
