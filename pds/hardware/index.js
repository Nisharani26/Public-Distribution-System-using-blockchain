const express = require("express");
const cors = require("cors");

const app = express();

let latestWeight = null;

app.use(cors());
app.use(express.json());

// Raspberry Pi sends weight here
app.post("/api/weight", (req, res) => {
  const { weight, unit, deviceId } = req.body;

  latestWeight = {
    weight,
    unit,
    deviceId,
    time: new Date()
  };

  console.log("📡 DATA FROM RASPBERRY PI");
  console.log(latestWeight);

  res.json({ status: "received" });
});

// Frontend fetches weight here
app.get("/api/weight", (req, res) => {
  if (!latestWeight) {
    return res.status(204).json({ message: "Waiting for weight" });
  }

  const data = latestWeight;

  // 🔁 IMPORTANT: reset after fetch
  latestWeight = null;

  res.json(data);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`⚙️ Hardware server running on port ${PORT}`);
});
