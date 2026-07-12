const express = require("express");
const router = express.Router();
const { createAsset, getAssets, getAssetById, updateAsset } = require("../controllers/assetController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getAssets).post(authorize("Admin", "AssetManager"), createAsset);
router.route("/:id").get(getAssetById).put(authorize("Admin", "AssetManager"), updateAsset);

module.exports = router;