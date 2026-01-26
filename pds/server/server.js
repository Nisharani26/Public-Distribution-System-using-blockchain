const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/citizen", require("./routes/citizenRoutes"));
app.use("/api/shopkeeper", require("./routes/shopRoutes"));

// ✅ USER STOCK ROUTE (THIS WAS MISSING)
app.use("/api/userStock", require("./routes/userStock"));
// USER TRANSACTION ROUTE
app.use("/api/transactions", require("./routes/userTransaction"));
app.use("/api/shopStock", require("./routes/shopStock"));
app.use("/api/shopTransaction", require("./routes/shopTransaction"));
app.use("/api/shop-stock", require("./routes/shopStockRoutes"));
app.use("/api/complaints", require("./routes/userComplaintRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
