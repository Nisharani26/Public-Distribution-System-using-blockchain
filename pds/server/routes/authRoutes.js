const express = require("express");
const router = express.Router();

const {
  authorityLogin,
  getAuthorityData,
  sendAuthorityOTP,
  verifyAuthorityOTP
} = require("../controllers/authController");

const { getAllAuthUsers } = require("../controllers/AuthUserController");
const { getAllAuthShops } = require("../controllers/AuthShopController");

const authMiddleware = require("../middleware/authMiddleware");

// -------- AUTHORITY ROUTES --------
router.post("/authority/login", authorityLogin);
router.post("/authority/send-otp", sendAuthorityOTP);
router.post("/authority/verify-otp", verifyAuthorityOTP);
router.get("/authority/dashboard", authMiddleware, getAuthorityData);

// -------- CITIZEN / USERS ROUTES --------
router.get("/authUsers/all", authMiddleware, getAllAuthUsers);

// -------- SHOPS ROUTES --------
router.get("/authShops/all", authMiddleware, getAllAuthShops);

module.exports = router;
