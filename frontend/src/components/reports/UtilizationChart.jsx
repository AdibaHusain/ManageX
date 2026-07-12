import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = { Allocated: "#f97316", Available: "#22c55e", "Under Maintenance": "#ef4444" };

export default function UtilizationChart({ data }) {
  if (!data) return null;
  const chartData = [
    { name: "Allocated", value: data.allocated },
    { name: "Available", value: data.available },
    { name: "Under Maintenance", value: data.underMaintenance },
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: 10 }}>Asset Utilization</h3>
      <PieChart width={320} height={260}>
        <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}