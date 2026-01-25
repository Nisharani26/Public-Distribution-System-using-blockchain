const express = require("express");
const router = express.Router();
const citizenAuthMiddleware = require("../middleware/citizenMiddleware");

const {
  citizenLogin,
  sendCitizenOTP,
  verifyCitizenOTP,
  getCitizenData
} = require("../controllers/citizenController");

// ✅ FIXED IMPORT
const {
  CitizenProfile,
  CitizenFamily,
  CitizenLogin
} = require("../models/Citizen");

// AUTH routes
router.post("/login", citizenLogin);
router.post("/send-otp", sendCitizenOTP);
router.post("/verify-otp", verifyCitizenOTP);

// DASHBOARD
router.get("/dashboard", citizenAuthMiddleware, getCitizenData);

// PROFILE
router.get("/profile/:rationId", citizenAuthMiddleware, async (req, res) => {
  try {
    const profile = await CitizenProfile.findOne({
      rationId: req.params.rationId,
    }).lean();

    const login = await CitizenLogin.findOne({
      rationId: req.params.rationId,
    }).lean();

    if (!profile || !login) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      ...profile,
      phone: login.phone,
      assignedShop: login.shopNo || "Not Assigned",
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// FAMILY
router.get("/family/:rationId", citizenAuthMiddleware, async (req, res) => {
  try {
    const family = await CitizenFamily.findOne({
      rationId: req.params.rationId,
    }).lean();

    if (!family) return res.json({ members: [] });

    res.json({ members: family.members });
  } catch (err) {
    console.error("FAMILY ERROR:", err);
    res.status(500).json({ members: [] });
  }
});

module.exports = router;
