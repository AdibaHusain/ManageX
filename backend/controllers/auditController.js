const AuditCycle = require("../models/AuditCycle");
const Asset = require("../models/Asset");

const createAuditCycle = async (req, res, next) => {
  try {
    const { scopeDepartment, scopeLocation, startDate, endDate, auditors, assetIds } = req.body;
    if (!startDate || !endDate || !assetIds?.length) {
      return res.status(400).json({ message: "startDate, endDate and at least one asset are required" });
    }

    const items = assetIds.map((assetId) => ({ asset: assetId, result: "Pending", notes: "" }));

    const auditCycle = await AuditCycle.create({
      scopeDepartment: scopeDepartment || null, scopeLocation: scopeLocation || null,
      startDate, endDate, auditors: auditors || [], items,
    });

    res.status(201).json(auditCycle);
  } catch (err) { next(err); }
};

const getAuditCycles = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const cycles = await AuditCycle.find(filter)
      .populate("scopeDepartment", "name").populate("auditors", "name email").sort({ createdAt: -1 });
    res.json(cycles);
  } catch (err) { next(err); }
};

const getAuditCycleById = async (req, res, next) => {
  try {
    const cycle = await AuditCycle.findById(req.params.id)
      .populate("scopeDepartment", "name").populate("auditors", "name email").populate("items.asset", "assetTag name status");
    if (!cycle) return res.status(404).json({ message: "Audit cycle not found" });
    res.json(cycle);
  } catch (err) { next(err); }
};

const markAssetResult = async (req, res, next) => {
  try {
    const { result, notes } = req.body;
    if (!["Verified", "Missing", "Damaged"].includes(result)) {
      return res.status(400).json({ message: "result must be Verified, Missing, or Damaged" });
    }

    const cycle = await AuditCycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: "Audit cycle not found" });
    if (cycle.status === "Closed") return res.status(400).json({ message: "Audit cycle is already closed" });

    const item = cycle.items.find((i) => i.asset.toString() === req.params.assetId);
    if (!item) return res.status(404).json({ message: "Asset not part of this audit cycle" });

    item.result = result;
    item.notes = notes || "";
    await cycle.save();
    res.json({ message: "Asset result recorded", item });
  } catch (err) { next(err); }
};

// Close karte hi discrepancy report auto-generate, aur missing/damaged asset status update
const closeAuditCycle = async (req, res, next) => {
  try {
    const cycle = await AuditCycle.findById(req.params.id).populate("items.asset", "assetTag name");
    if (!cycle) return res.status(404).json({ message: "Audit cycle not found" });
    if (cycle.status === "Closed") return res.status(400).json({ message: "Audit cycle is already closed" });

    const discrepancies = cycle.items.filter((i) => i.result === "Missing" || i.result === "Damaged");

    for (const item of discrepancies) {
      if (item.result === "Missing") {
        await Asset.findByIdAndUpdate(item.asset._id, { status: "Lost" });
      } else if (item.result === "Damaged") {
        await Asset.findByIdAndUpdate(item.asset._id, { condition: "Damaged" });
      }
      // Phase 5 (Risk Intelligence) ke liye counter badhao
      await Asset.findByIdAndUpdate(item.asset._id, { $inc: { auditFlagCount: 1 } });
    }

    cycle.status = "Closed";
    await cycle.save();

    res.json({
      message: "Audit cycle closed",
      discrepancyReport: discrepancies.map((d) => ({
        assetTag: d.asset.assetTag, assetName: d.asset.name, result: d.result, notes: d.notes,
      })),
    });
  } catch (err) { next(err); }
};

module.exports = { createAuditCycle, getAuditCycles, getAuditCycleById, markAssetResult, closeAuditCycle };