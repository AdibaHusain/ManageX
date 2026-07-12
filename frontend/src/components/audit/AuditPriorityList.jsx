import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import AuditRow from "./AuditRow";

export default function AuditPriorityList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/audits/priority-list")
      .then((res) => setList(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading priority list...</p>;

  return (
    <div className="card">
      <h3 style={{ marginBottom: 10 }}>Audit Priority List</h3>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>
        Sorted by risk score — high-risk assets appear first
      </p>
      {list.map(({ asset, risk }) => (
        <AuditRow key={asset._id} asset={asset} risk={risk} />
      ))}
    </div>
  );
}