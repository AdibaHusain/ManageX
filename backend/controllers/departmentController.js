const Department = require("../models/Department");

const createDepartment = async (req, res, next) => {
  try {
    const { name, code, head, parentDepartment } = req.body;
    const department = await Department.create({ name, code, head, parentDepartment });
    res.status(201).json(department);
  } catch (err) { next(err); }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate("head", "name email")
      .populate("parentDepartment", "name")
      .sort({ createdAt: -1 });
    res.json(departments);
  } catch (err) { next(err); }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (err) { next(err); }
};

const deactivateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, { status: "Inactive" }, { new: true });
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deactivated", department });
  } catch (err) { next(err); }
};

module.exports = { createDepartment, getDepartments, updateDepartment, deactivateDepartment };
