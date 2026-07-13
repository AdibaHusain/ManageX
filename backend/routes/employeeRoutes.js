const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getEmployees, promoteEmployee, updateEmployee } = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.use(protect);
router.get("/", authorize("Admin"), getEmployees);
router.patch("/:id/role", authorize("Admin"), promoteEmployee);
router.put("/:id", authorize("Admin"), updateEmployee);

module.exports = router;