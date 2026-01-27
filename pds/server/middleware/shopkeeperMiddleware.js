// backend/middleware/shopkeeperMiddleware.js
const jwt = require("jsonwebtoken");

const shopkeeperAuthMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach shopkeeper info to request
    req.shopkeeper = {
      shopNo: decoded.shopNo,   // 🔥 MUST come from JWT
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Shopkeeper Auth middleware error:", err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = shopkeeperAuthMiddleware;
