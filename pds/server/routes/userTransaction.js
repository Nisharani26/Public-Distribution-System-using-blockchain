// backend/routes/userTransactionRoutes.js

const express = require("express");
const router = express.Router();
const UserTransaction = require("../models/UserTransaction");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");
const hashData = require("../utils/hash");

// -------------------------
// Transaction Type Constant
// -------------------------
const TX_TYPE_USER = "0";

// -------------------------
// Deterministic Hash Payload
// -------------------------
function createHashPayload(tx) {
  return {
    shopNo: tx.shopNo,
    rationId: tx.rationId,
    items: tx.items.map(item => ({
      stockId: item.stockId,
      itemName: item.itemName,
      quantity: item.quantity
    })),
    transactionDate: tx.transactionDate
  };
}

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

    if (!shopNo)
      return res.status(400).json({ error: "shopNo is required" });

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
   3️⃣ CREATE TRANSACTION (Mongo + Blockchain)
   URL: /api/transactions/create
---------------------------- */
router.post("/create", async (req, res) => {
  try {
    const { shopNo, rationId, items } = req.body;

    if (!shopNo || !rationId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Save in MongoDB
    const transaction = new UserTransaction({
      shopNo,
      rationId,
      items,
      transactionDate: new Date()
    });

    await transaction.save();

    console.log("User Mongo TX ID:", transaction._id.toString());

    // 2️⃣ Deterministic Hash
    const hashPayload = createHashPayload(transaction);
    const hash = hashData(hashPayload);

    // 3️⃣ Push to Blockchain
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

    web3.eth.accounts.wallet.add(account);

    const receipt = await contract.methods
      .addTransaction(TX_TYPE_USER, transaction._id.toString(), hash)
      .send({
        from: account.address,
        gas: 300000,
      });


    // 4️⃣ BigInt Safe Receipt
    const safeReceipt = JSON.parse(
      JSON.stringify(receipt, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(201).json({
      message: "User transaction stored & block created",
      transaction,
      hash,
      receipt: safeReceipt
    });

  } catch (err) {
    console.error("Error creating user transaction:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ---------------------------
   4️⃣ FETCH BLOCKCHAIN USER TRANSACTIONS (Tamper Check)
   URL: /api/transactions/blockchain/:rationId
---------------------------- */
router.get("/blockchain/:rationId", async (req, res) => {
  try {
    const { rationId } = req.params;

    const txCount = await contract.methods.getTransactionCount().call();
    console.log("Total blockchain transactions:", txCount);

    let transactions = [];
    let seenMongoIds = new Set();

    for (let i = 0; i < Number(txCount); i++) {

      const tx = await contract.methods.getTransaction(i).call();

      // Only USER transactions
      if (tx.txType !== TX_TYPE_USER) continue;

      if (seenMongoIds.has(tx.mongoId)) continue;

      const dbTx = await UserTransaction.findById(tx.mongoId).lean();

      if (!dbTx) {
        transactions.push({
          transactionId: tx.mongoId,
          rationId,
          items: [],
          transactionDate: null,
          blockchainHash: tx.dataHash,
          currentHash: null,
          tampered: true,
          note: "DB record missing"
        });

        seenMongoIds.add(tx.mongoId);
        continue;
      }

      if (dbTx.rationId !== rationId) {
        seenMongoIds.add(tx.mongoId);
        continue;
      }

      const hashPayload = createHashPayload(dbTx);
      const recomputedHash = hashData(hashPayload);

      transactions.push({
        transactionId: tx.mongoId,
        shopNo: dbTx.shopNo,
        rationId: dbTx.rationId,
        items: dbTx.items,
        transactionDate: dbTx.transactionDate,
        blockchainHash: tx.dataHash,
        currentHash: recomputedHash,
        tampered: recomputedHash !== tx.dataHash
      });

      seenMongoIds.add(tx.mongoId);
    }

    res.json(transactions);

  } catch (err) {
    console.error("Fetch User Blockchain Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
