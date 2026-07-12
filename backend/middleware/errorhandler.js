const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `Duplicate value for field: ${field}` });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  res.status(err.statusCode || 500).json({ message: err.message || "Server Error" });
};

module.exports = errorHandler