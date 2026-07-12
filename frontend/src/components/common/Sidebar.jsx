import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assets", label: "Assets" },
  { to: "/allocation", label: "Allocation" },
  { to: "/booking", label: "Booking" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/audit", label: "Audit" },
  { to: "/reports", label: "Reports" },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}