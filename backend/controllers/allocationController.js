const Asset = require("../models/Asset");
const Allocation = require("../models/Allocation");
const TransferRequest = require("../models/TransferRequest");

const allocateAsset = async (req, res, next) => {
  try {
    const { assetId, employeeId, departmentId, expectedReturnDate } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    // Conflict rule — jaisa problem statement mein bola: "currently held by Priya" case
    const existingActive = await Allocation.findOne({ asset: assetId, status: "Active" }).populate("allocatedTo", "name email");
    if (existingActive) {
      return res.status(409).json({
        message: `This asset is currently held by ${existingActive.allocatedTo.name}. Use a Transfer Request instead.`,
        currentHolder: existingActive.allocatedTo,
        allocationId: existingActive._id,
      });
    }

    if (asset.status !== "Available") {
      return res.status(400).json({ message: `Asset is currently '${asset.status}' and cannot be allocated` });
    }

    const allocation = await Allocation.create({
      asset: assetId, allocatedTo: employeeId,
      department: departmentId || null, expectedReturnDate: expectedReturnDate || null,
    });

    asset.status = "Allocated";
    if (departmentId) asset.department = departmentId;
    await asset.save();

    res.status(201).json(allocation);
  } catch (err) { next(err); }
};

const requestTransfer = async (req, res, next) => {
  try {
    const { assetId, requestedDepartment } = req.body;
    const activeAllocation = await Allocation.findOne({ asset: assetId, status: "Active" });
    if (!activeAllocation) {
      return res.status(400).json({ message: "This asset is not currently allocated — allocate it directly instead" });
    }

    const transferRequest = await TransferRequest.create({
      asset: assetId,
      currentHolder: activeAllocation.allocatedTo,
      requestedBy: req.user._id,
      requestedDepartment: requestedDepartment || null,
    });

    res.status(201).json(transferRequest);
  } catch (err) { next(err); }
};

const { calculateRiskScore } = require("../utils/riskScore");

const getEmployeeRisk = async (req, res) => {
  try {
    const risk = await calculateRiskScore({ employeeId: req.params.employeeId });
    res.json(risk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveTransfer = async (req, res, next) => {
  try {
    const transferRequest = await TransferRequest.findById(req.params.id);
    if (!transferRequest) return res.status(404).json({ message: "Transfer request not found" });
    if (transferRequest.status !== "Requested") {
      return res.status(400).json({ message: `Transfer request already ${transferRequest.status}` });
    }

    // Purana allocation close karo (history preserved)
    const oldAllocation = await Allocation.findOne({ asset: transferRequest.asset, status: "Active" });
    if (oldAllocation) {
      oldAllocation.status = "Returned";
      oldAllocation.actualReturnDate = new Date();
      await oldAllocation.save();
    }

    const newAllocation = await Allocation.create({
      asset: transferRequest.asset,
      allocatedTo: transferRequest.requestedBy,
      department: transferRequest.requestedDepartment,
    });

    transferRequest.status = "Reallocated";
    transferRequest.approvedBy = req.user._id;
    await transferRequest.save();

    await Asset.findByIdAndUpdate(transferRequest.asset, {
      status: "Allocated",
      department: transferRequest.requestedDepartment || undefined,
    });

    res.json({ message: "Transfer approved and asset reallocated", transferRequest, newAllocation });
  } catch (err) { next(err); }
};

const rejectTransfer = async (req, res, next) => {
  try {
    const transferRequest = await TransferRequest.findByIdAndUpdate(
      req.params.id, { status: "Rejected", approvedBy: req.user._id }, { new: true }
    );
    if (!transferRequest) return res.status(404).json({ message: "Transfer request not found" });
    res.json(transferRequest);
  } catch (err) { next(err); }
};

const returnAsset = async (req, res, next) => {
  try {
    const { conditionOnReturn } = req.body;
    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) return res.status(404).json({ message: "Allocation not found" });
    if (allocation.status !== "Active") {
      return res.status(400).json({ message: "This allocation is already closed" });
    }

    allocation.status = "Returned";
    allocation.actualReturnDate = new Date();
    allocation.conditionOnReturn = conditionOnReturn || null;
    await allocation.save();

    await Asset.findByIdAndUpdate(allocation.asset, { status: "Available" });
    res.json({ message: "Asset returned successfully", allocation });
  } catch (err) { next(err); }
};

const getOverdueAllocations = async (req, res, next) => {
  try {
    const overdue = await Allocation.find({ status: "Active", expectedReturnDate: { $lt: new Date() } })
      .populate("asset", "assetTag name")
      .populate("allocatedTo", "name email");
    res.json(overdue);
  } catch (err) { next(err); }
};

const getAssetAllocationHistory = async (req, res, next) => {
  try {
    const history = await Allocation.find({ asset: req.params.assetId })
      .populate("allocatedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (err) { next(err); }
};

module.exports = {
  allocateAsset, requestTransfer, approveTransfer, rejectTransfer,
  returnAsset, getOverdueAllocations, getAssetAllocationHistory,
  getEmployeeRisk,   // ⬅️ ye add karo
};