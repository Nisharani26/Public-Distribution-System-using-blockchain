const express = require("express");
const router = express.Router();
const ShopStock = require("../models/shopStock");
const ShopTransaction = require("../models/shopTransaction");

router.post("/allocate", async (req, res) => {
  try {
    const { shopNo, month, year, items, allocatedBy } = req.body;

    if (!shopNo || !month || !year || !items?.length) {
      return res.status(400).json({ error: "Invalid data" });
    }

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
        if (item.quantity <= 0) continue;

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

    await ShopTransaction.create({
      shopNo,
      items,
      allocatedBy: allocatedBy || "authority",
    });

    res.status(200).json({ message: "Stock allocated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:shopNo/:month/:year", async (req, res) => {
  try {
    let { shopNo, month, year } = req.params;

    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    if (!month || month === "undefined") {
      month = months[new Date().getMonth()];
    }

    if (!year || year === "undefined") {
      year = new Date().getFullYear();
    } else {
      year = parseInt(year);
    }

    const stock = await ShopStock.findOne({ shopNo, month, year }).lean();
    if (!stock) return res.status(404).json({ message: "No stock found" });

    res.json(stock);
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
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
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
