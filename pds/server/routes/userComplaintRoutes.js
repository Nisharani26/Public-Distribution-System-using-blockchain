const express = require("express");
const router = express.Router();
const UserComplaint = require("../models/userComplaints");

/* ---------------- ADD COMPLAINT (Citizen) ---------------- */
router.post("/add", async (req, res) => {
  try {
    const {
      rationId,
      shopNo,
      citizenName,
      phone,
      description,
      authorityId,
    } = req.body;

    // 🔒 basic validation
    if (!rationId || !shopNo || !description || !authorityId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const complaint = await UserComplaint.create({
      rationId,
      shopNo,
      citizenName,
      phone,
      description,
      authorityId,
      status: "Pending",
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error("ADD COMPLAINT ERROR:", err);
    res.status(500).json({ message: "Failed to add complaint" });
  }
});

/* ---------------- GET COMPLAINTS BY RATION ID ---------------- */
router.get("/citizen/:rationId", async (req, res) => {
  try {
    const complaints = await UserComplaint.find({
      rationId: req.params.rationId,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

/* ---------------- GET COMPLAINTS BY SHOP (Authority) ---------------- */
router.get("/shop/:shopNo", async (req, res) => {
  try {
    const complaints = await UserComplaint.find({
      shopNo: req.params.shopNo,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

/* ---------------- GET COMPLAINTS BY AUTHORITY ---------------- */
router.get("/authority/:authorityId", async (req, res) => {
  try {
    const complaints = await UserComplaint.find({
      authorityId: req.params.authorityId,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

/* ---------------- UPDATE STATUS (Authority) ---------------- */
router.patch("/:id/status", async (req, res) => {
  try {
    const updated = await UserComplaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
