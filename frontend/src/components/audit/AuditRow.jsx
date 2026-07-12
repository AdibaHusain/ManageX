export default function AuditRow({ asset, risk }) {
  const badge = {
    High: { text: "🔴 Check First — Historically Flagged", color: "#b91c1c", bg: "#fee2e2" },
    Medium: { text: "🟡 Medium Risk", color: "#a16207", bg: "#fef9c3" },
    Low: null,
  }[risk.level];

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 16px", borderBottom: "1px solid #e2e8f0",
    }}>
      <div>
        <strong>{asset.name}</strong>
        <div style={{ fontSize: 12, color: "#64748b" }}>{asset.assetTag}</div>
      </div>
      {badge && (
        <span style={{ background: badge.bg, color: badge.color, padding: "4px 10px", borderRadius: 6, fontSize: 12 }}>
          {badge.text}
        </span>
      )}
    </div>
  );
}