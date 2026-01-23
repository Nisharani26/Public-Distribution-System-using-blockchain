const express = require("express");
const cors = require("cors");
let latestWeight = null;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/weight", (req, res) => {
  const { weight, unit, deviceId } = req.body;

  latestWeight = {
    weight,
    unit,
    deviceId,
    time: new Date()
  };

  console.log("----- DATA FROM RASPBERRY PI -----");
  console.log(latestWeight);
  console.log("---------------------------------");

  res.json({ status: "received" });
});

app.get("/api/weight", (req, res) => {
  if (!latestWeight) {
    return res.json({ message: "No data yet" });
  }
  res.json(latestWeight);
});


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Hardware server running on port ${PORT}`);
});
