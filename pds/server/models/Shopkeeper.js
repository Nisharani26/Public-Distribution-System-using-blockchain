const mongoose = require("mongoose");

const shopkeeperSchema = new mongoose.Schema(
  {
    name: {
      required: true
    },
    phone: {
      unique: true,
      required: true
    },
    shopId: {
      unique: true,
      required: true
    },
    location: {
      required: true
    },
    otp: {
      default: null
    },
    otpExpiry: {
      default: null
    },
    isVerified: {
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);
