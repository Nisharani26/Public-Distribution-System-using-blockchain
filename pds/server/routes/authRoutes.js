const express = require("express");
const router = express.Router();

const { authorityLogin, getAuthorityData } = require("../controllers/authController");
const { getAllAuthUsers } = require("../controllers/AuthUserController");
const { getAllAuthShops } = require("../controllers/AuthShopController"); // <-- import

const authMiddleware = require("../middleware/authMiddleware");

// -------- AUTHORITY ROUTES --------
router.post("/authority/login", authorityLogin);
router.get("/authority/dashboard", authMiddleware, getAuthorityData);

// -------- CITIZEN / USERS ROUTES (AUTH USER) --------
router.get("/authUsers/all", authMiddleware, getAllAuthUsers);

// -------- SHOPS ROUTES (AUTH SHOPS) --------
router.get("/authShops/all", authMiddleware, getAllAuthShops);

module.exports = router;
