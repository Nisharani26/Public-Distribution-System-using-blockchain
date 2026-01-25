const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  complaintNo: { type: String, required: true, unique: true }, // unique complaint number
  rationId: { type: String, required: true },                  // citizen rationId
  name: { type: String, required: true },                      // name of the head of family
  shopNo: { type: String, required: true },                   // assigned shop number
  description: { type: String, required: true },              // complaint details
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  date: { type: Date, default: Date.now }                     // date of complaint
});

// Model name is 'Complaint', collection name will automatically be 'complaints'
const Complaint = mongoose.model("Complaint", ComplaintSchema);

module.exports = Complaint;
