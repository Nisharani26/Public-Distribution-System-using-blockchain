const express = require("express");
const router = express.Router();
const shopkeeperAuthMiddleware = require("../middleware/ShopkeeperMiddleware");
const ShopLogin = require("../models/shopLogin");

const {
  shopkeeperLogin,
  sendShopkeeperOTP,
  verifyShopkeeperOTP,
  getShopkeeperData,
} = require("../controllers/shopkeeperController");

router.post("/login", shopkeeperLogin);
router.post("/send-otp", sendShopkeeperOTP);
router.post("/verify-otp", verifyShopkeeperOTP);
router.get("/dashboard", shopkeeperAuthMiddleware, getShopkeeperData);
// GET shops for a specific authority
router.get("/authority/:authorityId", async (req, res) => {
  try {
    const authorityId = req.params.authorityId;
    const shops = await ShopLogin.find({ authorityId });
    res.json(shops);
  } catch (err) {
    console.error("Failed to fetch shops:", err);
    res.status(500).json({ message: "Failed to fetch shops" });
  }
});
// Get shop by shopNo
router.get("/shop/:shopNo", async (req, res) => {
  try {
    const shopNo = req.params.shopNo;
    const shop = await ShopLogin.findOne({ shopNo });
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (err) {
    console.error("Failed to fetch shop:", err);
    res.status(500).json({ message: "Failed to fetch shop" });
  }
});

module.exports = router;
