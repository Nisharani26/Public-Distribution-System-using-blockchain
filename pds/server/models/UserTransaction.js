const mongoose = require("mongoose");

const UserTransactionSchema = new mongoose.Schema({
  shopNo: { type: String, required: true },
  rationId: { type: String, required: true },
  items: [
    {
      stockId: { type: String, required: true },
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  transactionDate: { type: Date, default: Date.now },
});

/* ---------------------------
   3️⃣ Create transaction
   URL: POST /api/transactions/create
---------------------------- */
router.post("/create", async (req, res) => {
  try {
    const { shopNo, rationId, items } = req.body;

    if (!shopNo || !rationId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing data" });
    }

    const transaction = new UserTransaction({
      shopNo,
      rationId,
      items,
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction saved successfully",
    });
  } catch (err) {
    console.error("Transaction save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


const UserTransaction = mongoose.model("UserTransaction", UserTransactionSchema, "userTransaction");

module.exports = UserTransaction;
