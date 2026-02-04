const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// =======================
// ROUTES
// =======================

// Auth
app.use("/api/auth", require("./routes/authRoutes"));

// Citizen
app.use("/api/citizen", require("./routes/citizenRoutes"));
app.use("/api/complaints", require("./routes/userComplaintRoutes"));
app.use("/api/userRequests", require("./routes/userRequest"));
app.use("/api/userStock", require("./routes/userStock"));
app.use("/api/transactions", require("./routes/userTransaction"));

// Shopkeeper
app.use("/api/shopkeeper", require("./routes/shopRoutes"));
app.use("/api/shopStock", require("./routes/shopStock"));
app.use("/api/shopTransaction", require("./routes/shopTransaction"));

// Shop Users (Citizen by Shop)
app.use("/api/shopUsers", require("./routes/shopUserRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
