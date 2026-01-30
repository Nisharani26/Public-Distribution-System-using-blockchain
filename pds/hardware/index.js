const express = require("express");
const cors = require("cors");

const app = express();

let latestWeight = null;

app.use(cors());
app.use(express.json());

// Raspberry Pi sends weight
app.post("/api/weight", (req, res) => {
  const { weight, unit, deviceId } = req.body;

  latestWeight = {
    weight: Number(weight),
    unit: unit || "kg",
    deviceId,
    time: new Date()
  };

  console.log("📡 DATA FROM RASPBERRY PI:", latestWeight);
  res.json({ status: "received" });
});

// Frontend fetches weight
app.get("/api/weight", (req, res) => {
  if (!latestWeight) {
    return res.status(200).json({ ready: false });
  }

  res.json({
    ready: true,
    ...latestWeight
  });
});

const PORT = 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚙️ Hardware server running on port ${PORT}`);
});
