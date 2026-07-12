const express = require("express");
const router = express.Router();
const {
  allocateAsset, requestTransfer, approveTransfer, rejectTransfer,
  returnAsset, getOverdueAllocations, getAssetAllocationHistory,
} = require("../controllers/allocationController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", authorize("Admin", "AssetManager"), allocateAsset);
router.post("/transfer-request", requestTransfer);
router.patch("/transfer-request/:id/approve", authorize("Admin", "AssetManager", "DepartmentHead"), approveTransfer);
router.patch("/transfer-request/:id/reject", authorize("Admin", "AssetManager", "DepartmentHead"), rejectTransfer);
router.patch("/:id/return", authorize("Admin", "AssetManager"), returnAsset);
router.get("/overdue", getOverdueAllocations);
router.get("/asset/:assetId", getAssetAllocationHistory);

module.exports = router;