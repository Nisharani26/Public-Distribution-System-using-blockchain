const mongoose = require("mongoose");

const AuthUserSchema = new mongoose.Schema(
  {
    rationId: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    shopNo: { type: String, required: true }
  },
  { collection: "citizenLogins" } // MAIN BASE COLLECTION
);

module.exports = mongoose.model("AuthUser", AuthUserSchema);
