const express = require("express");
const router = express.Router();
const shopkeeperAuthMiddleware = require("../middleware/ShopkeeperMiddleware");

const {
  shopkeeperLogin,
  sendShopkeeperOTP,
  verifyShopkeeperOTP,
  getShopkeeperData,
} = require("../controllers/ShopkeeperController");

router.post("/login", shopkeeperLogin);
router.post("/send-otp", sendShopkeeperOTP);
router.post("/verify-otp", verifyShopkeeperOTP);
router.get("/dashboard", shopkeeperAuthMiddleware, getShopkeeperData);

module.exports = router;
