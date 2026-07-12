import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import RiskWarningBadge from "./RiskWarningBadge";

export default function AllocationForm() {
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [risk, setRisk] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  useEffect(() => {
    api.get("/employees").then((res) => setEmployees(res.data));
    api.get("/assets?status=Available").then((res) => setAssets(res.data));
  }, []);

  const handleEmployeeSelect = async (employeeId) => {
    setSelectedEmployee(employeeId);
    setRisk(null);
    if (!employeeId) return;
    setLoadingRisk(true);
    try {
      const res = await api.get(`/allocations/risk/employee/${employeeId}`);
      setRisk(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRisk(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/allocations", { employee: selectedEmployee, asset: selectedAsset });
      alert("Asset allocated successfully");
      setSelectedEmployee("");
      setSelectedAsset("");
      setRisk(null);
    } catch (err) {
      alert(err.response?.data?.message || "Allocation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>New Allocation</h3>

      <label>Employee</label>
      <select value={selectedEmployee} onChange={(e) => handleEmployeeSelect(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "6px 0 14px" }}>
        <option value="">-- Select Employee --</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
        ))}
      </select>

      {loadingRisk && <p style={{ fontSize: 13, color: "#64748b" }}>Checking risk history...</p>}
      <RiskWarningBadge risk={risk} />

      <label style={{ display: "block", marginTop: 14 }}>Asset</label>
      <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)}
        style={{ width: "100%", padding: 8, margin: "6px 0 14px" }}>
        <option value="">-- Select Asset --</option>
        {assets.map((a) => (
          <option key={a._id} value={a._id}>{a.name} ({a.assetTag})</option>
        ))}
      </select>

      <button className="btn btn-primary" disabled={!selectedEmployee || !selectedAsset}>
        Allocate Asset
      </button>
    </form>
  );
}