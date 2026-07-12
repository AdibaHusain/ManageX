const Asset = require("../models/Asset");
const MaintenanceRequest = require("../models/MaintenanceRequest");

const raiseRequest = async (req, res, next) => {
  try {
    const { assetId, issueDescription, priority, photo } = req.body;
    if (!assetId || !issueDescription) return res.status(400).json({ message: "assetId and issueDescription are required" });

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const request = await MaintenanceRequest.create({
      asset: assetId, raisedBy: req.user._id, issueDescription,
      priority: priority || "Medium", photo: photo || null, status: "Pending",
    });

    res.status(201).json(request);
  } catch (err) { next(err); }
};

// Asset "Under Maintenance" tabhi hoga jab request Approve ho — pehle nahi
const decideRequest = async (req, res, next) => {
  try {
    const { decision } = req.body; // "Approved" | "Rejected"
    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "decision must be 'Approved' or 'Rejected'" });
    }

    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Maintenance request not found" });
    if (request.status !== "Pending") return res.status(400).json({ message: `Request already ${request.status}` });

    request.status = decision;
    request.approvedBy = req.user._id;
    await request.save();

    if (decision === "Approved") {
      await Asset.findByIdAndUpdate(request.asset, { status: "Under Maintenance" });
    }

    res.json({ message: `Request ${decision.toLowerCase()}`, request });
  } catch (err) { next(err); }
};

const assignTechnician = async (req, res, next) => {
  try {
    const { technicianAssigned } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Maintenance request not found" });
    if (request.status !== "Approved") return res.status(400).json({ message: "Technician can only be assigned to an Approved request" });

    request.technicianAssigned = technicianAssigned;
    request.status = "Technician Assigned";
    await request.save();
    res.json(request);
  } catch (err) { next(err); }
};

const startProgress = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Maintenance request not found" });
    if (request.status !== "Technician Assigned") return res.status(400).json({ message: "A technician must be assigned before starting work" });

    request.status = "In Progress";
    await request.save();
    res.json(request);
  } catch (err) { next(err); }
};

const resolveRequest = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Maintenance request not found" });
    if (request.status !== "In Progress") return res.status(400).json({ message: "Only an In Progress request can be resolved" });

    request.status = "Resolved";
    request.resolvedDate = new Date();
    await request.save();

    const asset = await Asset.findById(request.asset);
    if (asset && asset.status !== "Retired") {
      asset.status = "Available";
      await asset.save();
    }

    res.json({ message: "Maintenance resolved, asset available again", request });
  } catch (err) { next(err); }
};

const getAssetMaintenanceHistory = async (req, res, next) => {
  try {
    const history = await MaintenanceRequest.find({ asset: req.params.assetId })
      .populate("raisedBy", "name").populate("approvedBy", "name").sort({ createdAt: -1 });
    res.json(history);
  } catch (err) { next(err); }
};

const getRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await MaintenanceRequest.find(filter)
      .populate("asset", "assetTag name").populate("raisedBy", "name").sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) { next(err); }
};

module.exports = { raiseRequest, decideRequest, assignTechnician, startProgress, resolveRequest, getAssetMaintenanceHistory, getRequests };