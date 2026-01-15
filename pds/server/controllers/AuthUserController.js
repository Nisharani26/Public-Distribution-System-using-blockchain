const AuthUser = require("../models/AuthUser");
const AuthUserProfile = require("../models/AuthUserProfile");
const AuthUserFamily = require("../models/AuthUserFamily");

// GET ALL USERS (COMBINED DATA)
exports.getAllAuthUsers = async (req, res) => {
  try {
    const logins = await AuthUser.find(); // from citizenLogins

    const usersWithDetails = await Promise.all(
      logins.map(async (login) => {
        const profile = await AuthUserProfile.findOne({
          rationId: login.rationId
        });

        const family = await AuthUserFamily.findOne({
          rationId: login.rationId
        });

        return {
          rationId: login.rationId,
          phone: login.phone,
          shopNo: login.shopNo,

          // from citizenProfiles
          fullName: profile?.fullName || "Unknown",
          address: profile?.address || "Not available",
          district: profile?.district || "",
          state: profile?.state || "",
          email: profile?.email || "",

          // from citizenFamily
          familySize: family?.countOfFamilyMember || 0,
          familyMembers: family?.members || []
        };
      })
    );

    res.json(usersWithDetails);
  } catch (err) {
    console.error("Error fetching Auth Users:", err);
    res.status(500).json({ message: "Server error" });
  }
};
