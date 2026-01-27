const express = require("express");
const router = express.Router();
const { ShopUserLogin } = require("../models/shopUsers");

// GET total users for shop
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

// GET all users (optional)
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

module.exports = router;
