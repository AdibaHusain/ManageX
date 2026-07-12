import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const fetchNotifications = () => {
    if (!userId) return;
    api.get(`/notifications/${userId}`).then((res) => setNotifications(res.data));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // har 1 min refresh
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifications();
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
        <span style={{ fontSize: 20, color: "white" }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white",
            borderRadius: "50%", fontSize: 10, width: 16, height: 16, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: 32, width: 300, background: "white",
          borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 50, maxHeight: 350, overflowY: "auto",
        }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#1e293b" }}>
            Notifications
          </div>
          {notifications.length === 0 && (
            <div style={{ padding: 14, color: "#64748b", fontSize: 13 }}>No notifications</div>
          )}
          {notifications.map((n) => (
            <div key={n._id} onClick={() => markAsRead(n._id)} style={{
              padding: "10px 14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer",
              background: n.isRead ? "white" : "#eff6ff", fontSize: 13, color: "#1e293b",
            }}>
              <div>{n.message}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}