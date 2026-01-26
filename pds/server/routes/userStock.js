const express = require("express");
const router = express.Router();

const UserStock = require("../models/userStock");

// GET stock template
router.get("/template", async (req, res) => {
  try {
    const stockItems = await UserStock.find({}).lean();
    res.status(200).json(stockItems);
  } catch (err) {
    console.error("Error fetching user stock:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
