const express = require("express");
const router = express.Router();
const {
  createUserTransaction,
} = require("../controllers/userTransaction.controller");

router.post("/create", createUserTransaction);

module.exports = router;
