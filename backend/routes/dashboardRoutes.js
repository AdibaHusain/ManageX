const express = require("express");
const router = express.Router();
const { getDashboardKPIs } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getDashboardKPIs);

module.exports = router;