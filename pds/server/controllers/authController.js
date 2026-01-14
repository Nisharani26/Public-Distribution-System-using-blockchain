const Authority = require("../models/Authority");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.authorityLogin = async (req, res) => {
    const { authorityId, password } = req.body;
    try {
        const authority = await Authority.findOne({ authorityId });
        console.log("Found authority:", authority);

        if (!authority) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, authority.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: authority._id, authorityId: authority.authorityId, name: authority.name, role: "authority" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            authority: {
                authorityId: authority.authorityId,
                name: authority.name
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error. Try again." });
    }
};


exports.getAuthorityData = async (req, res) => {
    res.json({
        message: `Welcome ${req.authority.name}`,
        authority: req.authority
    });
};
