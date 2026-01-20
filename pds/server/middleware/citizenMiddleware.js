const jwt = require("jsonwebtoken");

const citizenAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach citizen info from token to request
    req.citizen = {
      citizenId: decoded.rationId,
      role: decoded.role
    };

    next();
  } catch (err) {
    console.error("Citizen Auth middleware error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = citizenAuthMiddleware;
