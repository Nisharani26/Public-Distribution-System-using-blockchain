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
const TX_TYPE_USER = 0;
const TX_TYPE_SHOP = 1;

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

    // Debug logs
    console.log("Allocating stock for shop:", shopNo);
    console.log("Mongo TX ID being sent to blockchain:", tx._id.toString());

    // 3️⃣ HASH GENERATE
    const hash = hashData(tx);

    // 4️⃣ BLOCKCHAIN PUSH
    const accounts = await web3.eth.getAccounts();
    console.log("Using account:", accounts[0]);

    const receipt = await contract.methods
      .addTransaction(TX_TYPE_SHOP.toString(), tx._id.toString(), hash)
      .send({ from: accounts[0], gas: 500000 });

    console.log("Blockchain addTransaction receipt:", receipt);

    res.status(200).json({
      message: "Stock allocated, transaction saved & block created",
      transaction: tx,
      hash,
      blockchainReceipt: JSON.parse(JSON.stringify(receipt, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )),
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
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
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
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
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
// Fetch Blockchain Transactions for Shop (Fixed)
// -------------------------
router.get("/transactions/:shopNo", async (req, res) => {
  try {
    const { shopNo } = req.params;

    const txCount = await contract.methods.getTransactionCount(TX_TYPE_SHOP).call();
    console.log("Total blockchain SHOP transactions:", txCount);

    let transactions = [];
    let seenMongoIds = new Set();

    for (let i = 0; i < txCount; i++) {
      const tx = await contract.methods.getTransaction(TX_TYPE_SHOP, i).call();
      console.log(`Blockchain TX ${i}:`, tx);

      // Avoid duplicates
      if (seenMongoIds.has(tx.mongoId)) {
        console.log(`Skipping duplicate MongoID ${tx.mongoId}`);
        continue;
      }

      const dbTx = await ShopTransaction.findById(tx.mongoId).lean();

      if (dbTx && dbTx.shopNo === shopNo) {
        const recomputedHash = hashData(dbTx);
        transactions.push({
          transactionId: tx.mongoId,
          shopNo: dbTx.shopNo,
          items: dbTx.items,
          transactionDate: dbTx.createdAt,
          blockchainHash: tx.dataHash,
          currentHash: recomputedHash,
          tampered: recomputedHash !== tx.dataHash,
        });
      } else if (!dbTx) {
        transactions.push({
          transactionId: tx.mongoId,
          shopNo: shopNo,
          items: [],
          transactionDate: null,
          blockchainHash: tx.dataHash,
          currentHash: null,
          tampered: true,
          note: "DB record missing",
        });
      }

      seenMongoIds.add(tx.mongoId);
    }

    res.json(transactions);

  } catch (err) {
    console.error("Error fetching blockchain transactions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
