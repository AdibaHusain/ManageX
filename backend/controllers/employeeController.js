const User = require("../models/User");

const getEmployees = async (req, res, next) => {
  try {
    const { department, role, status } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (role) filter.role = role;
    if (status) filter.status = status;

    const employees = await User.find(filter).select("-password").populate("department", "name").sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) { next(err); }
};

const promoteEmployee = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["Employee", "DepartmentHead", "AssetManager", "Admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(", ")}` });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: `${user.name} is now ${role}`, user });
  } catch (err) { next(err); }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { name, department, status } = req.body; // role yahan se exclude hai
    const user = await User.findByIdAndUpdate(req.params.id, { name, department, status }, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Employee not found" });
    res.json(user);
  } catch (err) { next(err); }
};

module.exports = { getEmployees, promoteEmployee, updateEmployee };

