const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (includes authority, users, and now shops)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/citizen", require("./routes/citizenRoutes"));
app.use("/api/shopkeeper", require("./routes/shopRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
