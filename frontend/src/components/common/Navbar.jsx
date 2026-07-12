import { useState, useEffect } from "react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    setUser(stored);
  }, []);

  return (
    <div className="navbar">
      <h2>AssetFlow</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <NotificationBell userId={user?._id} />
        <span>{user?.name || "Guest"}</span>
      </div>
    </div>
  );
}