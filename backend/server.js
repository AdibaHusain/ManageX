const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const departmentRoutes = require("./routes/departmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const assetRoutes = require("./routes/assetRoutes");

const app = express();   // <-- IMPORTANT

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/assets", assetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AssetIQ server running on port ${PORT}`);
});
