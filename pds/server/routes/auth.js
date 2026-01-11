const express = require("express");
const router = express.Router();
const { authorityLogin } = require("../controllers/authController");

router.post("/authority/login", authorityLogin);

module.exports = router;
