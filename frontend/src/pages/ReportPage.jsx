import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import UtilizationChart from "../components/reports/UtilizationChart";
import DeptChart from "../components/reports/DeptChart";

export default function ReportsPage() {
  const [utilization, setUtilization] = useState(null);
  const [deptData, setDeptData] = useState(null);

  useEffect(() => {
    api.get("/reports/utilization").then((res) => setUtilization(res.data));
    api.get("/reports/department-wise").then((res) => setDeptData(res.data));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Reports & Analytics</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <UtilizationChart data={utilization} />
        <DeptChart data={deptData} />
      </div>
    </div>
  );
}