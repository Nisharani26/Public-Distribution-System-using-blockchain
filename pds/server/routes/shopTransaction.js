const express = require("express");
const router = express.Router();
const ShopTransaction = require("../models/shopTransaction");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");
const hashData = require("../utils/hash");

// TEST ROUTE (important)
router.get("/test", (req, res) => {
  res.json({ message: "shopTransaction route working" });
});

// GET all transactions for a shop
// URL: /api/shopTransaction/shop/:shopNo
router.get("/shop/:shopNo", async (req, res) => {
  try {
    const { shopNo } = req.params;

    const transactions = await ShopTransaction.find({ shopNo })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Fetch shop transactions error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD transaction
// URL: /api/shopTransaction/add
router.post("/add", async (req, res) => {
  try {
    const { shopNo, items, allocatedBy } = req.body;

    if (!shopNo || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // 1. MongoDB save
    const tx = new ShopTransaction({
      shopNo,
      items,
      allocatedBy: allocatedBy || "authority",
    });

    await tx.save();

    // 2. Hash generate
    const hash = hashData(tx);

    // 3. Blockchain push
    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .addTransaction("SHOP", tx._id.toString(), hash)
      .send({
        from: accounts[0],
        gas: 300000,
      });

    res.status(200).json({
      message: "Shop transaction stored & block created",
      transaction: tx,
    });

  } catch (err) {
    console.error("Save shop transaction error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
