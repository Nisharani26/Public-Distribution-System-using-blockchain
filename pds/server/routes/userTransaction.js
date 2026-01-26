const express = require("express");
const router = express.Router();
const UserTransaction = require("../models/UserTransaction");

// GET transactions for a user
router.get("/:rationId", async (req, res) => {
  try {
    const { rationId } = req.params;

    const transactions = await UserTransaction.find({ rationId })
      .sort({ transactionDate: -1 })
      .lean();

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
