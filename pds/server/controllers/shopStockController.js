const ShopStock = require("../models/shopStock");
const ShopTransaction = require("../models/shopTransaction");

/* ===============================
   GET SHOP STOCK (MONTH/YEAR)
================================ */
exports.getShopStock = async (req, res) => {
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

    if (!stock) {
      return res.status(404).json({ message: "No stock data available" });
    }

    res.json(stock);
  } catch (err) {
    console.error("Shop stock fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ===============================
   ALLOCATE STOCK (AUTHORITY)
================================ */
exports.allocateStock = async (req, res) => {
  try {
    const { shopNo, month, year, items, allocatedBy } = req.body;

    if (!shopNo || !month || !year || !items?.length) {
      return res.status(400).json({ error: "Invalid data" });
    }

    for (const item of items) {
      await ShopStock.updateOne(
        { shopNo, month, year },
        {
          $inc: {
            "items.$[i].allocatedQty": item.quantity,
            "items.$[i].availableQty": item.quantity,
          },
        },
        {
          arrayFilters: [{ "i.stockId": item.stockId }],
        }
      );
    }

    await ShopTransaction.create({
      shopNo,
      items,
      allocatedBy: allocatedBy || "authority",
    });

    res.json({ message: "Stock allocated successfully" });
  } catch (err) {
    console.error("Allocation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ===============================
   CONFIRM CITIZEN PURCHASE
================================ */
exports.confirmPurchase = async (req, res) => {
  try {
    const { shopNo, month, year, items } = req.body;

    for (const item of items) {
      await ShopStock.updateOne(
        {
          shopNo,
          month,
          year,
          "items.stockId": item.stockId,
        },
        {
          $inc: {
            "items.$.availableQty": -item.quantity,
            "items.$.soldQty": item.quantity,
          },
        }
      );
    }

    res.json({ message: "Purchase confirmed" });
  } catch (err) {
    console.error("Confirm purchase error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
