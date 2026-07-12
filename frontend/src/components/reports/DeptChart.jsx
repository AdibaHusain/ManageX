import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DeptChart({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h3 style={{ marginBottom: 10 }}>Department-wise Allocation</h3>
      <BarChart width={420} height={260} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </div>
  );
}