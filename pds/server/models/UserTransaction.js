const mongoose = require("mongoose");

const UserTransactionSchema = new mongoose.Schema({
  shopNo: { type: String, required: true },
  rationId: { type: String, required: true },
  items: [
    {
      stockId: { type: String, required: true },
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  transactionDate: { type: Date, default: Date.now },
});

const UserTransaction = mongoose.model("UserTransaction", UserTransactionSchema, "userTransactions");

module.exports = UserTransaction;
