// utils/overdueChecker.js
const Allocation = require("../models/Allocation");
const { createNotification } = require("./notify");

const checkOverdueAllocations = async () => {
  const overdue = await Allocation.find({ status: "Active", expectedReturnDate: { $lt: new Date() } });
  for (const alloc of overdue) {
    alloc.status = "Overdue";
    await alloc.save();
    await createNotification(
      alloc.allocatedTo,   // ⬅️ tumhare schema ke hisaab se "employee" ki jagah "allocatedTo"
      `Asset return overdue (due ${alloc.expectedReturnDate.toDateString()})`,
      "Overdue"
    );
  }
};

module.exports = checkOverdueAllocations;