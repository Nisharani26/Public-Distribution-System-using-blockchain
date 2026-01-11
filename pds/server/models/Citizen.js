const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema(
  {
    name: {
      required: true
    },
    phone: {
      unique: true,
      required: true
    },
    rationCardNumber: {
      unique: true,
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

module.exports = mongoose.model("Citizen", citizenSchema);
