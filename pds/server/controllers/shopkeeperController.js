// backend/controllers/shopkeeperController.js
const ShopLogin = require("../models/ShopLogin");
const ShopStock = require("../models/shopStock");
const jwt = require("jsonwebtoken");

// In-memory OTP storage
const otpStore = new Map();

/* ---------- STEP 1: VERIFY SHOP NO ---------- */
exports.shopkeeperLogin = async (req, res) => {
  const { shopNo } = req.body;

  try {
    const login = await ShopLogin.findOne({ shopNo });
    if (!login)
      return res.status(401).json({ message: "Invalid Shop Number" });

    res.json({
      message: "Shop verified. Proceed to OTP.",
      shopNo: login.shopNo,
      phone: login.phone,
      name: login.shopName,
    });
  } catch (err) {
    console.error("Shopkeeper Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- STEP 2: SEND OTP ---------- */
exports.sendShopkeeperOTP = async (req, res) => {
  const { shopNo } = req.body;

  try {
    const login = await ShopLogin.findOne({ shopNo });
    if (!login)
      return res.status(404).json({ message: "Shopkeeper not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(shopNo, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    console.log(`✅ OTP for Shop ${shopNo}: ${otp}`);

    res.json({
      message: "OTP sent successfully",
      shopNo: login.shopNo,
      phone: login.phone,
      name: login.shopName,
    });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- STEP 3: VERIFY OTP ---------- */
exports.verifyShopkeeperOTP = async (req, res) => {
  const { shopNo, otp } = req.body;

  const storedData = otpStore.get(shopNo);
  if (!storedData)
    return res.status(400).json({ message: "OTP expired or not sent" });

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(shopNo);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (storedData.otp !== otp)
    return res.status(401).json({ message: "Invalid OTP" });

  const login = await ShopLogin.findOne({ shopNo });
  if (!login)
    return res.status(404).json({ message: "Shopkeeper not found" });

  const token = jwt.sign(
    { shopNo: login.shopNo, role: "SHOPKEEPER" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  otpStore.delete(shopNo);
  console.log(`✅ OTP verified for Shop ${shopNo}`);

  res.json({ message: "OTP verified successfully", token });
};

/* ---------- SHOPKEEPER DASHBOARD DATA ---------- */
exports.getShopkeeperData = async (req, res) => {
  try {
    const shopNo = req.shopkeeper.shopNo;

    const login = await ShopLogin.findOne({ shopNo }).select("-password");
    const stock = await ShopStock.findOne({ shopNo });

    if (!login)
      return res.status(404).json({ message: "Shopkeeper not found" });

    // Count assigned users
    const totalUsers = await require("../models/shopUsers").ShopUserLogin.countDocuments({ shopNo });

    res.json({
      name: login.shopName,
      shopId: login.shopNo,
      phone: login.phone,
      address: login.address,
      owner: login.shopOwnerName,
      totalUsers,
      stock: stock || {},
    });
  } catch (err) {
    console.error("Error fetching shopkeeper data:", err);
    res.status(500).json({ message: "Server error" });
  }
};
