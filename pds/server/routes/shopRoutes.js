// backend/routes/shopRoutes.js
const express = require("express");
const router = express.Router();
const shopkeeperAuthMiddleware = require("../middleware/shopkeeperMiddleware");
const ShopLogin = require("../models/ShopLogin");
const ShopProfile = require("../models/ShopProfile"); // Add this
const { ShopUserLogin } = require("../models/shopUsers");

// Controllers
const {
  shopkeeperLogin,
  sendShopkeeperOTP,
  verifyShopkeeperOTP,
} = require("../controllers/shopkeeperController");

// ---------------- LOGIN ----------------
router.post("/login", shopkeeperLogin);

// ---------------- SEND OTP ----------------
router.post("/send-otp", sendShopkeeperOTP);

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", verifyShopkeeperOTP);

// ---------------- SHOPKEEPER PROFILE ----------------
router.get("/profile", shopkeeperAuthMiddleware, async (req, res) => {
  try {
    const shopNo = req.shopkeeper.shopNo;

    // Fetch login info
    const login = await ShopLogin.findOne({ shopNo }).select("-password");
    if (!login) return res.status(404).json({ message: "Shop not found" });

    // Fetch profile info
    const profile = await ShopProfile.findOne({ shopNo });

    // Count assigned users
    const totalUsers = await ShopUserLogin.countDocuments({ shopNo });

    res.status(200).json({
      name: login.shopName,             // Shop name
      shopId: login.shopNo,             // Shop number
      phone: login.phone,               // Shop phone
      owner: login.shopOwnerName,       // Shop owner
      totalUsers,                       // Assigned users
      address: profile?.address || "N/A",   // From ShopProfile
      district: profile?.district || "N/A", // From ShopProfile
      state: profile?.state || "N/A",       // From ShopProfile
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
