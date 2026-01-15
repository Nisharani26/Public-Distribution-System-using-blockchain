const express = require("express");
const router = express.Router();
const { authorityLogin, getAuthorityData } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// LOGIN
router.post("/authority/login", authorityLogin);

// DASHBOARD (protected route)
router.get("/authority/dashboard", authMiddleware, getAuthorityData);

module.exports = router;
