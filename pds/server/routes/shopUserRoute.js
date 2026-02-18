const express = require("express");
const router = express.Router();
const { ShopUserLogin } = require("../models/shopUsers");
// ✅ Twilio setup (add at top of file)
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

const otpStore = new Map(); // replace let otpStore = {};


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

// Generate OTP
router.post("/generateOtp/:rationId", async (req, res) => {
  try {
    const { rationId } = req.params;

    if (!rationId) {
      return res.status(400).json({
        success: false,
        message: "Missing rationId",
      });
    }

    const user = await ShopUserLogin.findOne({ rationId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ FIX: use correct DB field name "phone"
    if (!user.phone) {
      console.error("Phone number missing for rationId:", rationId);
      return res.status(400).json({
        success: false,
        message: "Phone number not found",
      });
    }

    console.log("Phone from DB:", user.phone);

    // ✅ generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ store OTP
    otpStore.set(rationId, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // ✅ use correct field: phone
    let mobileNumber = String(user.phone).replace(/\D/g, "");

    // ensure it is exactly 10 digits
    if (mobileNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number in database",
      });
    }

    // ALWAYS add +91
    mobileNumber = "+91" + mobileNumber;

    console.log("Sending OTP to:", mobileNumber);

    // ✅ send SMS via Twilio
    await twilioClient.messages.create({
      body: `PDS System OTP: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobileNumber,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error("Twilio Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});


// Verify OTP
router.post("/verifyOtp/:rationId", (req, res) => {
  const { rationId } = req.params;
  const { otp } = req.body;

  if (!otp || !rationId) {
    return res.status(400).json({
      success: false,
      message: "Missing data",
    });
  }

  // get stored OTP data
  const storedData = otpStore.get(rationId);

  // check if OTP exists
  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: "OTP expired or not generated",
    });
  }

  // check expiry
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(rationId);
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  // check OTP match
  if (storedData.otp !== otp) {
    return res.status(401).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // OTP correct → delete after use
  otpStore.delete(rationId);

  console.log(`OTP verified for Ration ID ${rationId}`);

  return res.json({
    success: true,
    message: "OTP verified successfully",
  });
});


module.exports = router;
