const mongoose = require("mongoose");

// ----- LOGIN SCHEMA -----
const AuthorityLoginSchema = new mongoose.Schema({
  authorityId: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "AUTHORITY"
  }
});

// ----- PROFILE SCHEMA -----
const AuthorityProfileSchema = new mongoose.Schema({
  authorityId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  designation: {
    type: String
  },
  district: {
    type: String
  },
  state: {
    type: String
  },
  email: {
    type: String
  }
});

// ----- CREATE MODELS -----
const AuthorityLogin = mongoose.model(
  "AuthorityLogin",
  AuthorityLoginSchema,
  "authorityLogins"
);

const AuthorityProfile = mongoose.model(
  "AuthorityProfile",
  AuthorityProfileSchema,
  "authorityProfiles"
);

// ----- EXPORT BOTH MODELS -----
module.exports = {
  AuthorityLogin,
  AuthorityProfile
};
