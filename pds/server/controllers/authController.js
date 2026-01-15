const mongoose = require("mongoose");
const Authority = require("../models/Authority"); // points to authorityLogins collection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
exports.authorityLogin = async (req, res) => {
  const { authorityId, password } = req.body;

  try {
    // Lookup authority profile using authorityId
    const authorityData = await Authority.aggregate([
      { $match: { authorityId } }, // match login collection
      {
        $lookup: {
          from: "authorityProfiles", // collection name for profile
          localField: "authorityId",
          foreignField: "authorityId",
          as: "profile"
        }
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } } // flatten the profile array
    ]);

    const authority = authorityData[0];

    console.log("Found authority:", authority);

    if (!authority) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password from login collection
    const isMatch = await bcrypt.compare(password, authority.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: authority._id, authorityId: authority.authorityId, role: "AUTHORITY" ,name: authority.name},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      authority: {
        authorityId: authority.authorityId,
        mobile: authority.mobile,
        name: authority.profile?.name || "Authority", // get name from profile
        designation: authority.profile?.designation || "",
        district: authority.profile?.district || "",
        state: authority.profile?.state || "",
        email: authority.profile?.email || ""
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Try again." });
  }
};

// GET DASHBOARD DATA
exports.getAuthorityData = async (req, res) => {
  try {
    const authorityId = req.authority.authorityId;

    // Fetch authority login + profile data
    const authorityData = await Authority.aggregate([
      { $match: { authorityId } },
      {
        $lookup: {
          from: "authorityProfiles",
          localField: "authorityId",
          foreignField: "authorityId",
          as: "profile"
        }
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } }
    ]);

    const authority = authorityData[0];

    res.json({
      message: `Welcome ${authority.profile?.name || authority.authorityId}`,
      authority: {
        authorityId: authority.authorityId,
        mobile: authority.mobile,
        name: authority.profile?.name || "",
        designation: authority.profile?.designation || "",
        district: authority.profile?.district || "",
        state: authority.profile?.state || "",
        email: authority.profile?.email || ""
      }
    });

  } catch (err) {
    console.error("Error fetching authority data:", err);
    res.status(500).json({ message: "Server error" });
  }
};
