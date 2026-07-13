const User = require("../models/User");
const jwt = require("jsonwebtoken");
// bcrypt yahan import karne ki zaroorat nahi — model khud handle karta hai

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    // ⬅️ plain password hi bhejo, pre("save") hook khud hash karega
    const user = await User.create({ name, email, password, role: "Employee" });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) { next(err); }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password); // ⬅️ model ka apna method use karo
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) { next(err); }
};


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

module.exports = { loginUser, signupUser, getEmployees, promoteEmployee, updateEmployee };
