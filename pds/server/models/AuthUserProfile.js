const mongoose = require("mongoose");

const AuthUserProfileSchema = new mongoose.Schema(
  {
    rationId: { type: String, required: true, unique: true },
    fullName: String,
    age: Number,
    gender: String,
    email: String,
    address: String,
    district: String,
    state: String
  },
  { collection: "citizenProfiles" }
);

module.exports = mongoose.model("AuthUserProfile", AuthUserProfileSchema);
