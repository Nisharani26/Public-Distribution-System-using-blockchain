const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
  if (req.user.role !== "authority") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({
    message: "Welcome Authority",
    authorityId: req.user.id,
    designation: req.user.designation
  });
});

module.exports = router;
