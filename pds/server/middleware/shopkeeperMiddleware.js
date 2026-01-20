const jwt = require("jsonwebtoken");

const shopkeeperAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token)
      return res.status(401).json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.shopkeeper = {
      shopNo: decoded.shopNo,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Shopkeeper Auth middleware error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = shopkeeperAuthMiddleware;