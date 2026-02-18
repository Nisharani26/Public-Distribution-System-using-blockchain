const { AuthorityLogin, AuthorityProfile } = require("../models/Authority");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const otpStore = new Map();

// ✅ Twilio Setup
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

/* =======================
   STEP 1: LOGIN (PASSWORD)
======================= */
exports.authorityLogin = async (req, res) => {
  const { authorityId, password } = req.body;
  try {
    const login = await AuthorityLogin.findOne({ authorityId });
    if (!login) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, login.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const profile = await AuthorityProfile.findOne({ authorityId });

    res.json({
      message: "Password verified. Proceed to OTP.",
      authorityId: login.authorityId,
      mobile: login.mobile,
      name: profile?.name || login.authorityId, // fetch real name
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Try again." });
  }
};

// /* =======================
//    STEP 2: SEND OTP
// ======================= */
// exports.sendAuthorityOTP = async (req, res) => {
//   const { authorityId } = req.body;
//   try {
//     const login = await AuthorityLogin.findOne({ authorityId });
//     if (!login) return res.status(404).json({ message: "Authority not found" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     otpStore.set(authorityId, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

//     console.log(`✅ OTP for ${authorityId}: ${otp}`);
//     res.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("OTP Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// send otp to mobile number using twilio
exports.sendAuthorityOTP = async (req, res) => {
  const { authorityId } = req.body;

  try {
    const login = await AuthorityLogin.findOne({ authorityId });

    if (!login)
      return res.status(404).json({ message: "Authority not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(authorityId, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log("Mobile number:", login.mobile);
    console.log("OTP:", otp);

    // ✅ SEND SMS HERE
    await twilioClient.messages.create({
      body: `PDS System OTP: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${login.mobile}`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("Twilio Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* =======================
   STEP 3: VERIFY OTP
======================= */
exports.verifyAuthorityOTP = async (req, res) => {
  const { authorityId, otp } = req.body;

  const storedData = otpStore.get(authorityId);
  if (!storedData) return res.status(400).json({ message: "OTP expired or not sent" });
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(authorityId);
    return res.status(400).json({ message: "OTP expired" });
  }
  if (storedData.otp !== otp) return res.status(401).json({ message: "Invalid OTP" });

  const login = await AuthorityLogin.findOne({ authorityId });
  if (!login) return res.status(404).json({ message: "Authority not found" });

  const token = jwt.sign(
    { authorityId: login.authorityId, role: "AUTHORITY" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  otpStore.delete(authorityId);
  console.log(`✅ OTP verified successfully for ${authorityId}`);
  res.json({ message: "OTP verified successfully", token });
};

/* =======================
   DASHBOARD DATA
======================= */
exports.getAuthorityData = async (req, res) => {
  try {
    const authorityId = req.authority.authorityId;

    const login = await AuthorityLogin.findOne({ authorityId });
    const profile = await AuthorityProfile.findOne({ authorityId });

    if (!login) return res.status(404).json({ message: "Authority not found" });

    const fullData = {
      authorityId: login.authorityId,
      mobile: login.mobile,
      name: profile?.name || login.authorityId,
      designation: profile?.designation || "",
      district: profile?.district || "",
      state: profile?.state || "",
      email: profile?.email || ""
    };

    res.json({
      message: `Welcome ${fullData.name}`,
      authority: fullData
    });
  } catch (err) {
    console.error("Error fetching authority data:", err);
    res.status(500).json({ message: "Server error" });
  }
};



