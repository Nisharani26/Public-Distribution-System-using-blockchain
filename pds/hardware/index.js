const express = require("express");
const cors = require("cors");

const app = express();

let latestWeight = null;

app.use(cors());
app.use(express.json());

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

app.get("/api/weight", (req, res) => {
  if (!latestWeight) {
    return res.status(200).json({ ready: false });
  }

  res.json({
    ready: true,
    ...latestWeight
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`⚙️ Hardware server running on port ${PORT}`);
});
