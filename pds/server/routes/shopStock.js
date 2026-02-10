const express = require("express");
const router = express.Router();
const ShopStock = require("../models/shopStock");
const ShopTransaction = require("../models/shopTransaction");
const Stock = require("../models/stock");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");
const hashData = require("../utils/hash");

// -------------------------
// Transaction Type Constants
// -------------------------
const TX_TYPE_SHOP = 1; // Enum index in smart contract for SHOP

// -------------------------
// Allocate Stock to Shop
// -------------------------
router.post("/allocate", async (req, res) => {
  try {
    const { shopNo, month, year, items, allocatedBy } = req.body;

    if (!shopNo || !month || !year || !items?.length) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // 1️⃣ STOCK UPDATE
    let stockDoc = await ShopStock.findOne({ shopNo, month, year });

    if (!stockDoc) {
      stockDoc = await ShopStock.create({
        shopNo,
        month,
        year,
        items: items.map(i => ({
          stockId: i.stockId,
          itemName: i.itemName,
          allocatedQty: i.quantity,
          availableQty: i.quantity,
          soldQty: 0,
        })),
      });
    } else {
      for (const item of items) {
        const existingItem = stockDoc.items.find(i => i.stockId === item.stockId);
        if (existingItem) {
          existingItem.allocatedQty += item.quantity;
          existingItem.availableQty += item.quantity;
        } else {
          stockDoc.items.push({
            stockId: item.stockId,
            itemName: item.itemName,
            allocatedQty: item.quantity,
            availableQty: item.quantity,
            soldQty: 0,
          });
        }
      }
      await stockDoc.save();
    }

    // 2️⃣ TRANSACTION SAVE (MongoDB)
    const tx = await ShopTransaction.create({
      shopNo,
      items,
      allocatedBy: allocatedBy || "authority",
    });

    // 3️⃣ HASH GENERATE
    const hash = hashData(tx);

    // 4️⃣ BLOCKCHAIN PUSH
    const accounts = await web3.eth.getAccounts();
    await contract.methods
      .addTransaction(TX_TYPE_SHOP, tx._id.toString(), hash)
      .send({ from: accounts[0], gas: 300000 });

    res.status(200).json({
      message: "Stock allocated, transaction saved & block created",
      transaction: tx,
      hash,
    });

  } catch (err) {
    console.error("Error allocating stock:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// Fetch Shop Stock (Merged with Master)
// -------------------------
router.get("/:shopNo/:month/:year", async (req, res) => {
  try {
    let { shopNo, month, year } = req.params;
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    if (!month || month === "undefined") month = months[new Date().getMonth()];
    if (!year || year === "undefined") year = new Date().getFullYear();
    else year = parseInt(year);

    const shopStock = await ShopStock.findOne({ shopNo, month, year }).lean();
    const masterStock = await Stock.find().lean();

    const mergedItems = masterStock.map(ms => {
      const existing = shopStock?.items.find(i => i.stockId === ms.stockId);
      return {
        stockId: ms.stockId,
        itemName: ms.itemName,
        allocatedQty: existing?.allocatedQty || 0,
        availableQty: existing?.availableQty || 0,
      };
    });

    res.json({ shopNo, month, year, items: mergedItems });

  } catch (err) {
    console.error("Error fetching shop stock:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// Reduce Stock Quantity
// -------------------------
router.put("/reduceStock/:shopNo/:month/:year", async (req, res) => {
  try {
    let { shopNo, month, year } = req.params;
    const { stockId, quantity } = req.body;

    if (quantity <= 0) return res.status(400).json({ error: "Invalid quantity" });

    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    if (!month || month === "undefined") month = months[new Date().getMonth()];
    if (!year || year === "undefined") year = new Date().getFullYear();
    else year = parseInt(year);

    const stockDoc = await ShopStock.findOne({ shopNo, month, year });
    if (!stockDoc) return res.status(404).json({ error: "Stock not found" });

    const item = stockDoc.items.find(i => i.stockId === stockId);
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.availableQty < quantity) return res.status(400).json({ error: "Insufficient stock" });

    item.availableQty -= quantity;
    item.soldQty += quantity;
    await stockDoc.save();

    res.json({ message: "Stock reduced successfully", item });

  } catch (err) {
    console.error("Error reducing stock:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// -------------------------
// Fetch Blockchain Transactions for Shop
// -------------------------
router.get("/transactions/:shopNo", async (req, res) => {
  try {
    const { shopNo } = req.params;

    // fetch USER transactions
    const TX_TYPE_USER = 1;
    const txCount = await contract.methods.getTransactionCount(TX_TYPE_USER).call();
    console.log("Total blockchain USER transactions:", txCount);

    let transactions = [];

    for (let i = 0; i < txCount; i++) {
      const tx = await contract.methods.getTransaction(TX_TYPE_USER, i).call();
      console.log(`Blockchain TX ${i}:`, tx);

      // Only include transactions for this shop
      if (tx.shopNoStored === shopNo) {
        const dbTx = await ShopTransaction.findById(tx.id).lean();

        let recomputedHash = null;
        if (dbTx) {
          try { recomputedHash = hashData(dbTx); } catch {}
        }

        transactions.push({
          transactionId: tx.id,
          shopNo: dbTx?.shopNo || shopNo,
          items: dbTx?.items || [],
          transactionDate: dbTx?.createdAt || null,
          blockchainHash: tx.hash,
          currentHash: recomputedHash,
          tampered: recomputedHash !== tx.hash,
          note: dbTx ? "" : "DB record missing",
        });
      }
    }

    res.json(transactions);

  } catch (err) {
    console.error("Error fetching blockchain transactions:", err);
    res.status(500).json({ error: "Server error fetching blockchain transactions" });
  }
});

module.exports = router;
