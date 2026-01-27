// backend/models/shopUsers.js
const mongoose = require("mongoose");

/** ----------------------------------------
 * Shop Users (Citizen Login)
 * Collection: citizenLogins
 * Stores rationId, phone, and shopNo
 ---------------------------------------- */
const ShopUserLoginSchema = new mongoose.Schema(
  {
    rationId: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    shopNo: { type: String, required: true },
  },
  { collection: "citizenLogins" }
);
const ShopUserLogin = mongoose.model("ShopUserLogin", ShopUserLoginSchema);

/** ----------------------------------------
 * Shop Users Family
 * Collection: citizenFamily
 * Stores family members of a citizen
 ---------------------------------------- */
const ShopUserFamilySchema = new mongoose.Schema(
  {
    rationId: { type: String, required: true, unique: true },
    countOfFamilyMember: { type: Number, default: 0 },
    members: [
      {
        memberName: String,
        relation: String,
        age: Number,
        gender: String,
      },
    ],
  },
  { collection: "citizenFamily" }
);
const ShopUserFamily = mongoose.model("ShopUserFamily", ShopUserFamilySchema);

/** ----------------------------------------
 * Shop Users Profile
 * Collection: citizenProfiles
 * Stores profile details like name, age, address, etc.
 ---------------------------------------- */
const ShopUserProfileSchema = new mongoose.Schema(
  {
    rationId: { type: String, required: true, unique: true },
    fullName: String,
    age: Number,
    gender: String,
    email: String,
    address: String,
    district: String,
    state: String,
  },
  { collection: "citizenProfiles" }
);
const ShopUserProfile = mongoose.model("ShopUserProfile", ShopUserProfileSchema);

/** Export all shop-specific models */
module.exports = { ShopUserLogin, ShopUserFamily, ShopUserProfile };
