const mongoose = require("mongoose");

const userRequestSchema = new mongoose.Schema(
  {
    rationId: { type: String, required: true },
    shopNo: { type: String, required: true },
    itemName: { type: String, required: true },
    requestedQty: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userRequest", userRequestSchema,"userRequest");
