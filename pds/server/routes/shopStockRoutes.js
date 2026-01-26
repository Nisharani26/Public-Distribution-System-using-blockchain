const express = require("express");
const router = express.Router();

const {
  getShopStock,
  allocateStock,
  confirmPurchase,
} = require("../controllers/shopStockController");

// GET shop stock
router.get("/:shopNo/:month/:year", getShopStock);

// Authority allocate stock
router.post("/allocate", allocateStock);

// Shopkeeper confirm citizen purchase
router.post("/confirm", confirmPurchase);

module.exports = router;
