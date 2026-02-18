const express = require("express");
const router = express.Router();
const { ShopUserLogin } = require("../models/shopUsers");

/** -------------------------------
 * Existing Routes
 ------------------------------- */

// GET total users for a shop
router.get("/:shopNo/count", async (req, res) => {
  try {
    const totalUsers = await ShopUserLogin.countDocuments({
      shopNo: req.params.shopNo,
    });
    res.json({ totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all users for a shop
router.get("/:shopNo/all", async (req, res) => {
  try {
    const users = await ShopUserLogin.find({
      shopNo: req.params.shopNo,
    }).lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/** -------------------------------
 * OTP Functionality (Temporary In-Memory)
 ------------------------------- */
let otpStore = {}; // Stores OTPs for each rationId

// Generate OTP
router.post("/generateOtp/:rationId", (req, res) => {
  const { rationId } = req.params;
  if (!rationId) return res.status(400).json({ success: false, message: "Missing rationId" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore[rationId] = otp;

  console.log(`Generated OTP for Ration ID ${rationId}: ${otp}`);
  res.json({ success: true, message: "OTP generated. Check server console." });
});

// Verify OTP
router.post("/verifyOtp/:rationId", (req, res) => {
  const { rationId } = req.params;
  const { otp } = req.body;

  if (!otp || !rationId) return res.status(400).json({ success: false, message: "Missing data" });

  if (otpStore[rationId] && otpStore[rationId] === otp) {
    delete otpStore[rationId]; // OTP can be used only once
    console.log(`OTP verified for Ration ID ${rationId}`);
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.json({ success: false, message: "Invalid OTP" });
  }
});


module.exports = router;
