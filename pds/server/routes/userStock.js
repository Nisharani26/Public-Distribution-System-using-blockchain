const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const UserStock = mongoose.model("userStock"); // collection: userStock

// Get all stock templates
router.get("/template", async (req, res) => {
  try {
    const stockItems = await UserStock.find({}); // fetch all items
    res.json(stockItems); // returns array of stock items
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
