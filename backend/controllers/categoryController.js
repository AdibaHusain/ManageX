const AssetCategory = require("../models/AssetCategory");

const createCategory = async (req, res, next) => {
  try {
    const { name, prefix, customFields } = req.body;
    const category = await AssetCategory.create({ name, prefix, customFields });
    res.status(201).json(category);
  } catch (err) { next(err); }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await AssetCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await AssetCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) { next(err); }
};

module.exports = { createCategory, getCategories, updateCategory };
