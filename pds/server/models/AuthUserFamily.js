const mongoose = require("mongoose");

const AuthUserFamilySchema = new mongoose.Schema(
  {
    rationId: { type: String, required: true, unique: true },
    countOfFamilyMember: Number,
    members: [
      {
        memberName: String,
        relation: String,
        age: Number,
        gender: String
      }
    ]
  },
  { collection: "citizenFamily" }
);

module.exports = mongoose.model("AuthUserFamily", AuthUserFamilySchema);
