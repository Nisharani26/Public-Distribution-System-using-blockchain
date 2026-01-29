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
          items: 1,
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

    const transactions = await UserTransaction.aggregate([
      { $match: { shopNo } },
      {
        $project: {
          _id: 1,
          shopNo: 1,
          rationId: 1,
          userName: { $ifNull: ["$userName", "-"] },
          items: 1,
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

/* ---------------------------
   3️⃣ CREATE TRANSACTION  ✅ (NEW)
   URL: /api/transactions/create
---------------------------- */
router.post("/create", async (req, res) => {
  try {
    const { shopNo, rationId, items } = req.body;

    if (!shopNo || !rationId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = new UserTransaction({
      shopNo,
      rationId,
      items,
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
