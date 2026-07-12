export default function RiskWarningBadge({ risk }) {
  if (!risk || risk.level === "Low") return null;

  const styles = {
    High: { background: "#fee2e2", color: "#b91c1c", icon: "🔴" },
    Medium: { background: "#fef9c3", color: "#a16207", icon: "🟡" },
  };
  const s = styles[risk.level];

  return (
    <div style={{ background: s.background, color: s.color, padding: "10px 14px", borderRadius: 8, marginTop: 10, fontSize: 14 }}>
      {s.icon} <strong>{risk.level} Risk</strong> — {risk.breakdown.overdueCount} overdue return(s) on record for this employee
    </div>
  );
}