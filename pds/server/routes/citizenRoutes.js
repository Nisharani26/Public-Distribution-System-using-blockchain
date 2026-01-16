const express = require("express");
const router = express.Router();
const citizenAuthMiddleware = require("../middleware/citizenMiddleware");

const {
  citizenLogin,
  sendCitizenOTP,
  verifyCitizenOTP,
  getCitizenData
} = require("../controllers/citizenController");

router.post("/login", citizenLogin);
router.post("/send-otp", sendCitizenOTP);
router.post("/verify-otp", verifyCitizenOTP);
router.get("/dashboard", citizenAuthMiddleware, getCitizenData);

module.exports = router;
