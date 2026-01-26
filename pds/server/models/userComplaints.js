const mongoose = require("mongoose");

const userComplaintSchema = new mongoose.Schema(
  {
    rationId: {
      type: String,
      required: true,
    },

    shopNo: {
      type: String,
      required: true,
    },

    citizenName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Resolved","In Progress"],
      default: "Pending",
    },

    authorityId: {
      type: String,
      required: true, // make true if every complaint must belong to an authority
    },
  },
  {
    timestamps: true,
    collection: "userComplaints",
  }
);

module.exports = mongoose.model("userComplaint", userComplaintSchema);
