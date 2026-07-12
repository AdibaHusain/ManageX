import AuditPriorityList from "../components/audit/AuditPriorityList";

export default function AuditPage() {
  return (
    <div>
      <h2>Asset Audit</h2>
      {/* apna existing "start audit cycle" form yahan upar rakh sakte ho */}
      <AuditPriorityList />
    </div>
  );
}