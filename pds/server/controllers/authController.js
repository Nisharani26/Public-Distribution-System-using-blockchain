const Authority = require("../models/Authority");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.authorityLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const authority = await Authority.findOne({ email });
    if (!authority) {
      return res.status(404).json({ message: "Authority not found" });
    }

    const isMatch = await bcrypt.compare(password, authority.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: authority._id,
        role: "authority",
        designation: authority.designation
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Authority login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
