const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    stockId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    rate: { type: Number, default: 0 },
  },
  {
    collection: "stock", // yeh tumhare existing cluster collection ka name
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", StockSchema);
