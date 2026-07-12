const express = require("express");
const router = express.Router();
const { createCategory, getCategories, updateCategory } = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getCategories).post(authorize("Admin"), createCategory);
router.route("/:id").put(authorize("Admin"), updateCategory);

module.exports = router;
