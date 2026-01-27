// backend/routes/userTransactionRoutes.js
const express = require("express");
const router = express.Router();
const UserTransaction = require("../models/UserTransaction");

/* ---------------------------
   1️⃣ Get transactions by rationId
   URL: /api/transactions/user/:rationId
---------------------------- */
router.get("/user/:rationId", async (req, res) => {
  try {
    const { rationId } = req.params;
    if (!rationId)
      return res.status(400).json({ error: "rationId is required" });

    const transactions = await UserTransaction.aggregate([
      { $match: { rationId } },
      {
        $project: {
          _id: 1,
          shopNo: 1,
          rationId: 1,
          userName: { $ifNull: ["$userName", "-"] },
          items: 1, // keep array intact
          transactionDate: 1,
          smsStatus: { $ifNull: ["$smsStatus", "-"] },
        },
      },
      { $sort: { transactionDate: -1 } },
    ]);

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by rationId:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------
   2️⃣ Get transactions by shopNo
   URL: /api/transactions/shop/:shopNo
---------------------------- */
router.get("/shop/:shopNo", async (req, res) => {
  try {
    const { shopNo } = req.params;
    if (!shopNo) return res.status(400).json({ error: "shopNo is required" });

    // ✅ Same logic as rationId route
    const transactions = await UserTransaction.aggregate([
      { $match: { shopNo } },
      {
        $project: {
          _id: 1,
          shopNo: 1,
          rationId: 1,
          userName: { $ifNull: ["$userName", "-"] },
          items: 1, // keep array intact
          transactionDate: 1,
          smsStatus: { $ifNull: ["$smsStatus", "-"] },
        },
      },
      { $sort: { transactionDate: -1 } },
    ]);

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by shopNo:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
