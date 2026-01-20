const AuthUser = require("../models/AuthUser");
const AuthUserProfile = require("../models/AuthUserProfile");
const AuthUserFamily = require("../models/AuthUserFamily");
const ShopLogin = require("../models/ShopLogin");   // ← IMPORTANT

// GET USERS ONLY FOR LOGGED-IN AUTHORITY
exports.getAllAuthUsers = async (req, res) => {
  try {
    const authorityId = req.authority.authorityId; // from JWT

    // STEP 1: Find all shops belonging to this authority
    const shops = await ShopLogin.find(
      { authorityId },
      { shopNo: 1, _id: 0 }
    );

    const shopNos = shops.map(s => s.shopNo);

    // If authority has no shops
    if (shopNos.length === 0) {
      return res.json([]);
    }

    // STEP 2: Get only users whose shopNo belongs to these shops
    const logins = await AuthUser.find({
      shopNo: { $in: shopNos }
    });

    // STEP 3: Attach profile + family data
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

          fullName: profile?.fullName || "Unknown",
          address: profile?.address || "Not available",
          district: profile?.district || "",
          state: profile?.state || "",
          email: profile?.email || "",

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
