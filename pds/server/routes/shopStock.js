const express = require("express");
const router = express.Router();
const ShopStock = require("../models/shopStock");
const ShopTransaction = require("../models/shopTransaction");
const Stock = require("../models/stock");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");
const hashData = require("../utils/hash");

router.post("/allocate", async (req, res) => {
  try {
    const { shopNo, month, year, items, allocatedBy } = req.body;

    if (!shopNo || !month || !year || !items?.length) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // 1️⃣ STOCK UPDATE (same as before)
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
        const existingItem = stockDoc.items.find(
          i => i.stockId === item.stockId
        );

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
      .addTransaction("SHOP", tx._id.toString(), hash)
      .send({
        from: accounts[0],
        gas: 300000,
      });

    res.status(200).json({
      message: "Stock allocated, transaction saved & block created",
      transaction: tx,
      hash,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:shopNo/:month/:year", async (req, res) => {
  try {
    let { shopNo, month, year } = req.params;

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (!month || month === "undefined") {
      month = months[new Date().getMonth()];
    }

    if (!year || year === "undefined") {
      year = new Date().getFullYear();
    } else {
      year = parseInt(year);
    }

    const shopStock = await ShopStock.findOne({ shopNo, month, year }).lean();
    const masterStock = await Stock.find().lean(); // master stock

    // Merge: ensure all master items are present
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/reduceStock/:shopNo/:month/:year", async (req, res) => {
  try {
    let { shopNo, month, year } = req.params;
    const { stockId, quantity } = req.body;

    if (quantity <= 0)
      return res.status(400).json({ error: "Invalid quantity" });

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (!month || month === "undefined") {
      month = months[new Date().getMonth()];
    }

    if (!year || year === "undefined") {
      year = new Date().getFullYear();
    } else {
      year = parseInt(year);
    }

    const stockDoc = await ShopStock.findOne({ shopNo, month, year });
    if (!stockDoc) return res.status(404).json({ error: "Stock not found" });

    const item = stockDoc.items.find(i => i.stockId === stockId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.availableQty < quantity)
      return res.status(400).json({ error: "Insufficient stock" });

    item.availableQty -= quantity;
    item.soldQty += quantity;

    await stockDoc.save();
    res.json({ message: "Stock reduced successfully", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
