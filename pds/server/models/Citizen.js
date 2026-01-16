const mongoose = require("mongoose");

const CitizenFamilySchema = new mongoose.Schema({
  rationId: { type: String, required: true, unique: true },
  countOfFamilyMember: { type: Number, required: true },
  members: [
    {
      memberName: { type: String, required: true },
      relation: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
    },
  ],
});

const CitizenLoginSchema = new mongoose.Schema({
  rationId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  shopNo: { type: String, required: true },
  role: { type: String, default: "CITIZEN" },
});

const CitizenProfileSchema = new mongoose.Schema({
  rationId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  district: { type: String },
  state: { type: String },
});

// Export models with proper names
const CitizenFamily = mongoose.model("CitizenFamily", CitizenFamilySchema, "citizenFamily");
const CitizenLogin = mongoose.model("CitizenLogin", CitizenLoginSchema, "citizenLogins");
const CitizenProfile = mongoose.model("CitizenProfile", CitizenProfileSchema, "citizenProfiles");

module.exports = { CitizenFamily, CitizenLogin, CitizenProfile };
