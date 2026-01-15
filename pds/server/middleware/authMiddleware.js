const jwt = require("jsonwebtoken");
const Authority = require("../models/Authority");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full authority data from DB
    const authority = await Authority.findById(decoded.id).select("-password"); // exclude password
    if (!authority) {
      return res.status(401).json({ message: "Authority not found" });
    }

    req.authority = authority; // attach full authority object
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
