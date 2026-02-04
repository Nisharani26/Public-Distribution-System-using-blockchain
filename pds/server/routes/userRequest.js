const express = require("express");
const router = express.Router();
const UserRequest = require("../models/userRequest");

// CREATE REQUEST
router.post("/create", async (req, res) => {
  try {
    const { rationId, shopNo, itemName, requestedQty } = req.body;

    if (!rationId || !shopNo || !itemName || !requestedQty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const request = new UserRequest(req.body);
    await request.save();

    res.status(201).json(request);
  } catch (err) {
    console.error("User request creation error:", err);
    res.status(500).json({ message: "Request failed" });
  }
});
// GET all requests of a rationId
router.get("/myRequests/:rationId", async (req, res) => {
  try {
    const requests = await UserRequest.find({ rationId: req.params.rationId });
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});
router.put("/mark-received/:rationId", async (req, res) => {
  try {
    const { rationId } = req.params;
    const { items } = req.body; // items = array of item names that were actually verified

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided to mark as received" });
    }

    // Only update requests that match verified items
    await UserRequest.updateMany(
      { rationId, itemName: { $in: items }, status: "Pending" },
      { $set: { status: "Received" } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update request status" });
  }
});


module.exports = router;
