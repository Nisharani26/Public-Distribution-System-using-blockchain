const ShopLogin = require("../models/ShopLogin");
const ShopProfile = require("../models/ShopProfile");

// Fetch combined shop data
exports.getAllAuthShops = async (req, res) => {
  try {
    const shopLogins = await ShopLogin.find();
    console.log("shopLogins:", shopLogins);

    const shopProfiles = await ShopProfile.find();
    console.log("shopProfiles:", shopProfiles);

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

    console.log("Combined shops:", shops);

    res.status(200).json(shops);
  } catch (err) {
    console.error("Error in getAllAuthShops:", err);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
};

