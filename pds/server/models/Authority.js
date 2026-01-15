const mongoose = require("mongoose");

const AuthoritySchema = new mongoose.Schema({
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
  },

  // ---- PROFILE PART (previously in authorityProfiles) ----
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

module.exports = mongoose.model("Authority", AuthoritySchema, "authorityLogins");
