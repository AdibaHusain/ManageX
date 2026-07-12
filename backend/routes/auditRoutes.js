const express = require("express");
const router = express.Router();
const { createAuditCycle, getAuditCycles, getAuditCycleById, markAssetResult, closeAuditCycle } = require("../controllers/auditController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", authorize("Admin", "AssetManager"), createAuditCycle);
router.get("/", getAuditCycles);
router.get("/:id", getAuditCycleById);
router.patch("/:id/item/:assetId", markAssetResult);
router.patch("/:id/close", authorize("Admin", "AssetManager"), closeAuditCycle);

module.exports = router;