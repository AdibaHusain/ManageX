const Allocation = require("../models/Allocation");
const AuditCycle = require("../models/AuditCycle"); // adjust name if different

const WEIGHTS = {
  overdueHistory: 0.4,
  auditMismatch: 0.35,
  allocationDuration: 0.25,
};

const normalize = (value, cap) => {
  if (!value) return 0;
  return Math.min((value / cap) * 100, 100);
};

// (a) Employee ka past overdue-return count
const getEmployeeOverdueCount = async (employeeId) => {
  return Allocation.countDocuments({
    employee: employeeId,
    status: "Overdue",
  });
};

// (b) Asset ka audit-mismatch history (Missing/Damaged)
const getAssetAuditMismatchCount = async (assetId) => {
  const result = await AuditCycle.aggregate([
    { $unwind: "$assetChecks" },
    {
      $match: {
        "assetChecks.asset": assetId,
        "assetChecks.condition": { $in: ["Missing", "Damaged"] },
      },
    },
    { $count: "mismatchCount" },
  ]);
  return result.length ? result[0].mismatchCount : 0;
};

// (c) Asset kitne din se allocated hai bina return ke
const getAssetAllocationDurationDays = async (assetId) => {
  const active = await Allocation.findOne({ asset: assetId, status: { $in: ["Active", "Overdue"] } });
  if (!active) return 0;
  return Math.floor((Date.now() - new Date(active.allocatedDate)) / 86400000);
};

// Master function
const calculateRiskScore = async ({ employeeId, assetId }) => {
  const overdueCount = employeeId ? await getEmployeeOverdueCount(employeeId) : 0;
  const mismatchCount = assetId ? await getAssetAuditMismatchCount(assetId) : 0;
  const allocationDays = assetId ? await getAssetAllocationDurationDays(assetId) : 0;

  const totalScore =
    normalize(overdueCount, 5) * WEIGHTS.overdueHistory +
    normalize(mismatchCount, 3) * WEIGHTS.auditMismatch +
    normalize(allocationDays, 60) * WEIGHTS.allocationDuration;

  const level = totalScore >= 66 ? "High" : totalScore >= 33 ? "Medium" : "Low";

  return {
    score: Math.round(totalScore),
    level,
    breakdown: { overdueCount, mismatchCount, allocationDays },
  };
};

module.exports = { calculateRiskScore };