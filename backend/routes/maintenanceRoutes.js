const express = require("express");
const router = express.Router();
const {
  raiseRequest, decideRequest, assignTechnician, startProgress,
  resolveRequest, getAssetMaintenanceHistory, getRequests,
} = require("../controllers/maintenanceController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", raiseRequest);
router.get("/", authorize("Admin", "AssetManager"), getRequests);
router.patch("/:id/decision", authorize("Admin", "AssetManager"), decideRequest);
router.patch("/:id/assign", authorize("Admin", "AssetManager"), assignTechnician);
router.patch("/:id/start", authorize("Admin", "AssetManager"), startProgress);
router.patch("/:id/resolve", authorize("Admin", "AssetManager"), resolveRequest);
router.get("/asset/:assetId", getAssetMaintenanceHistory);

module.exports = router;