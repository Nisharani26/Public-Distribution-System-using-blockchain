const ShopLogin = require("../models/ShopLogin");
const ShopProfile = require("../models/ShopProfile");

// Fetch combined shop data ONLY for the logged-in authority
exports.getAllAuthShops = async (req, res) => {
  try {
    const authorityId = req.authority.authorityId; // from JWT

    // STEP 1: Get only shops belonging to this authority
    const shopLogins = await ShopLogin.find({ authorityId });

    // If this authority has no shops
    if (shopLogins.length === 0) {
      return res.status(200).json([]);
    }

    const shopProfiles = await ShopProfile.find();

    // STEP 2: Combine login + profile data
    const shops = shopLogins.map(login => {
      const profile = shopProfiles.find(p => p.shopNo === login.shopNo);
      return {
        shopNo: login.shopNo,
        phone: login.phone,
        role: login.role,
        authorityId: login.authorityId,
        shopName: profile?.shopName || "",
        shopOwnerName: profile?.shopOwnerName || "",
        address: profile?.address || "",
        district: profile?.district || "",
        state: profile?.state || ""
      };
    });

    res.status(200).json(shops);
  } catch (err) {
    console.error("Error in getAllAuthShops:", err);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
};
