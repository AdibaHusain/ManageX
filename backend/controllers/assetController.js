const Asset = require("../models/Asset");
const AssetCategory = require("../models/AssetCategory");
const generateAssetTag = require("../utils/assetTag");

const createAsset = async (req, res, next) => {
  try {
    const { name, category, serialNumber, acquisitionDate, acquisitionCost, condition, location, department, photos, isBookable, customFieldValues } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const categoryDoc = await AssetCategory.findById(category);
    if (!categoryDoc) return res.status(404).json({ message: "Category not found" });

    const assetTag = await generateAssetTag(categoryDoc.prefix);

    const asset = await Asset.create({
      assetTag, name, category, serialNumber, acquisitionDate, acquisitionCost,
      condition, location, department, photos, isBookable, customFieldValues,
      status: "Available",
    });

    res.status(201).json(asset);
  } catch (err) { next(err); }
};

const getAssets = async (req, res, next) => {
  try {
    const { search, category, status, department, location } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { assetTag: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (location) filter.location = { $regex: location, $options: "i" };

    const assets = await Asset.find(filter).populate("category", "name prefix").populate("department", "name").sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) { next(err); }
};

const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id).populate("category", "name prefix customFields").populate("department", "name");
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) { next(err); }
};

const updateAsset = async (req, res, next) => {
  try {
    const { assetTag, status, ...safeUpdates } = req.body; // tag/status direct edit se block
    const asset = await Asset.findByIdAndUpdate(req.params.id, safeUpdates, { new: true, runValidators: true });
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) { next(err); }
};

module.exports = { createAsset, getAssets, getAssetById, updateAsset };
