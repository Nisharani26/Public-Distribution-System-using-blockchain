// const { CitizenLogin, CitizenProfile, CitizenFamily } = require("../models/Citizen");
// const jwt = require("jsonwebtoken");

// // In-memory OTP storage (for simplicity, can later use Redis)
// const otpStore = new Map();

// /* ---------- STEP 1: VERIFY RATION ID ---------- */
// exports.citizenLogin = async (req, res) => {
//   const { rationId } = req.body;

//   try {
//     // Check if citizen exists in login collection
//     const login = await CitizenLogin.findOne({ rationId });
//     if (!login) return res.status(401).json({ message: "Invalid Ration ID" });

//     // Get profile info
//     const profile = await CitizenProfile.findOne({ rationId });

//     res.json({
//       message: "Ration ID verified. Proceed to OTP.",
//       rationId: login.rationId,
//       phone: login.phone,
//       name: profile?.fullName || login.rationId,
//     });
//   } catch (err) {
//     console.error("Citizen Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ---------- STEP 2: SEND OTP ---------- */
// exports.sendCitizenOTP = async (req, res) => {
//   const { rationId, phone } = req.body;

//   try {
//     const login = await CitizenLogin.findOne({ rationId });
//     if (!login) return res.status(404).json({ message: "Citizen not found" });

//     const profile = await CitizenProfile.findOne({ rationId });

//     // Optional phone validation
//     if (phone && login.phone !== phone) {
//       return res.status(401).json({ message: "Phone number does not match Ration ID" });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     otpStore.set(rationId, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 minutes
//     console.log(`✅ OTP for ${rationId}: ${otp}`);

//     res.json({
//       message: "OTP sent successfully",
//       rationId: login.rationId,
//       phone: login.phone,                 // send phone
//       fullName: profile?.fullName || "",  // send fullName
//       assignedShop: login.shopNo || null, // send assignedShop
//     });
//   } catch (err) {
//     console.error("OTP Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// /* ---------- STEP 3: VERIFY OTP ---------- */
// exports.verifyCitizenOTP = async (req, res) => {
//   const { rationId, otp } = req.body;

//   const storedData = otpStore.get(rationId);
//   if (!storedData) return res.status(400).json({ message: "OTP expired or not sent" });

//   if (Date.now() > storedData.expiresAt) {
//     otpStore.delete(rationId);
//     return res.status(400).json({ message: "OTP expired" });
//   }

//   if (storedData.otp !== otp) return res.status(401).json({ message: "Invalid OTP" });

//   const login = await CitizenLogin.findOne({ rationId });
//   if (!login) return res.status(404).json({ message: "Citizen not found" });

//   // Generate JWT token
//   const token = jwt.sign(
//   { rationId: login.rationId, role: "citizen" },
//   process.env.JWT_SECRET,
//   { expiresIn: "1d" }
// );

//   otpStore.delete(rationId);
//   console.log(`✅ OTP verified successfully for ${rationId}`);

//   res.json({ message: "OTP verified successfully", token });
// };

// /* ---------- CITIZEN DASHBOARD DATA ---------- */
// exports.getCitizenData = async (req, res) => {
//   try {
//     const rationId = req.citizen.rationId; // from JWT middleware
//     const login = await CitizenLogin.findOne({ rationId }).lean();
//     const profile = await CitizenProfile.findOne({ rationId }).lean();
//     const family = await CitizenFamily.findOne({ rationId }).lean();

//     console.log("DEBUG: login:", login);
//     console.log("DEBUG: profile:", profile);
//     console.log("DEBUG: family:", family);

//     if (!login) return res.status(404).json({ message: "Citizen not found" });

//     const fullData = {
//       rationId: login.rationId,
//       phone: login.phone,
//       shopNo: login.shopNo,
//       profile: profile || {},
//       family: family || {},
//     };

//     res.json({
//       message: `Welcome ${profile?.fullName || rationId}`,
//       citizen: fullData,
//     });
//   } catch (err) {
//     console.error("Error fetching citizen data:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// otp for mobile 

const { CitizenLogin, CitizenProfile, CitizenFamily } = require("../models/Citizen");
const jwt = require("jsonwebtoken");

// ✅ Twilio Setup
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

// In-memory OTP storage
const otpStore = new Map();


/* ---------- STEP 1: VERIFY RATION ID ---------- */
exports.citizenLogin = async (req, res) => {
  const { rationId } = req.body;

  try {
    const login = await CitizenLogin.findOne({ rationId });

    if (!login)
      return res.status(401).json({ message: "Invalid Ration ID" });

    const profile = await CitizenProfile.findOne({ rationId });

    res.json({
      message: "Ration ID verified. Proceed to OTP.",
      rationId: login.rationId,
      phone: login.phone,
      name: profile?.fullName || login.rationId,
    });

  } catch (err) {
    console.error("Citizen Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ---------- STEP 2: SEND OTP ---------- */
exports.sendCitizenOTP = async (req, res) => {

  const { rationId, phone } = req.body;

  try {

    const login = await CitizenLogin.findOne({ rationId });

    if (!login)
      return res.status(404).json({ message: "Citizen not found" });

    const profile = await CitizenProfile.findOne({ rationId });

    // Optional phone validation
    if (phone && login.phone !== phone) {
      return res.status(401).json({
        message: "Phone number does not match Ration ID"
      });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    otpStore.set(rationId, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // ✅ Send OTP via Twilio SMS
    await twilioClient.messages.create({

      body: `PDS System Your OTP is ${otp}. Enter this code to verify your login. Do not share this code with anyone.`,

      from: process.env.TWILIO_PHONE_NUMBER,

      to: '+91' + login.phone

    });

    console.log(`✅ OTP sent to mobile ${login.phone}`);

    res.json({

      message: "OTP sent successfully",

      rationId: login.rationId,

      phone: login.phone,

      fullName: profile?.fullName || "",

      assignedShop: login.shopNo || null,

    });

  } catch (err) {

    console.error("OTP Error:", err);

    res.status(500).json({ message: "Server error" });

  }

};


/* ---------- STEP 3: VERIFY OTP ---------- */
exports.verifyCitizenOTP = async (req, res) => {

  const { rationId, otp } = req.body;

  try {

    const storedData = otpStore.get(rationId);

    if (!storedData)
      return res.status(400).json({
        message: "OTP expired or not sent"
      });

    if (Date.now() > storedData.expiresAt) {

      otpStore.delete(rationId);

      return res.status(400).json({
        message: "OTP expired"
      });

    }

    if (storedData.otp !== otp)
      return res.status(401).json({
        message: "Invalid OTP"
      });

    const login = await CitizenLogin.findOne({ rationId });

    if (!login)
      return res.status(404).json({
        message: "Citizen not found"
      });

    // ✅ Generate JWT token
    const token = jwt.sign(

      {
        rationId: login.rationId,
        role: "citizen"
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d"
      }

    );

    otpStore.delete(rationId);

    console.log(`✅ OTP verified successfully for ${rationId}`);

    res.json({

      message: "OTP verified successfully",

      token

    });

  } catch (err) {

    console.error("Verify OTP Error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* ---------- CITIZEN DASHBOARD DATA ---------- */
exports.getCitizenData = async (req, res) => {

  try {

    const rationId = req.citizen.rationId;

    const login = await CitizenLogin.findOne({ rationId }).lean();

    const profile = await CitizenProfile.findOne({ rationId }).lean();

    const family = await CitizenFamily.findOne({ rationId }).lean();

    if (!login)
      return res.status(404).json({
        message: "Citizen not found"
      });

    const fullData = {

      rationId: login.rationId,

      phone: login.phone,

      shopNo: login.shopNo,

      profile: profile || {},

      family: family || {},

    };

    res.json({

      message: `Welcome ${profile?.fullName || rationId}`,

      citizen: fullData,

    });

  } catch (err) {

    console.error("Error fetching citizen data:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

};
