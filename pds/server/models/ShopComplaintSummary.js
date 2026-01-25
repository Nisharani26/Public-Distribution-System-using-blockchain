const mongoose = require("mongoose");

const ShopComplaintSummarySchema = new mongoose.Schema({
  shopNo: { type: String, required: true },           // Shop number
  month: { type: String, required: true },            // Month, e.g., "January"
  year: { type: Number, required: true },             // Year, e.g., 2026
  totalComplaints: { type: Number, default: 0 }      // Number of complaints for this shop in the given month
});

// Model name is 'ShopComplaintSummary', collection name will be 'shopComplaintSummaries'
const ShopComplaintSummary = mongoose.model(
  "ShopComplaintSummary",
  ShopComplaintSummarySchema
);

module.exports = ShopComplaintSummary;
