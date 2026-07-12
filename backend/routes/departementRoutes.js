const express = require("express");
const router = express.Router();
const { createDepartment, getDepartments, updateDepartment, deactivateDepartment } = require("../controllers/departmentController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getDepartments).post(authorize("Admin"), createDepartment);
router.route("/:id").put(authorize("Admin"), updateDepartment).delete(authorize("Admin"), deactivateDepartment);

module.exports = router;
