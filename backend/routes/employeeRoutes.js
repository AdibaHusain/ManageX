const express = require("express");
const router = express.Router();
const { getEmployees, promoteEmployee, updateEmployee } = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.get("/", authorize("Admin"), getEmployees);
router.patch("/:id/role", authorize("Admin"), promoteEmployee);
router.put("/:id", authorize("Admin"), updateEmployee);

module.exports = router;