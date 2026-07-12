const Asset = require("../models/Asset");

const generateAssetTag = async (prefix = "AF") => {
  const cleanPrefix = prefix.toUpperCase().trim();
  const lastAsset = await Asset.findOne({ assetTag: { $regex: `^${cleanPrefix}-\\d+$` } }).sort({ createdAt: -1 });

  let nextNumber = 1;
  if (lastAsset) {
    const lastNumber = parseInt(lastAsset.assetTag.split("-")[1], 10);
    if (!Number.isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }
  return `${cleanPrefix}-${String(nextNumber).padStart(4, "0")}`;
};

module.exports = generateAssetTag;
