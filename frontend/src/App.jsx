import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssetDirectory from "./pages/AssetDirectory";
import AllocationPage from "./pages/AllocationPage";
import BookingPage from "./pages/BookingPage";
import MaintenancePage from "./pages/MaintenancePage";
import AuditPage from "./pages/AuditPage";
import ReportsPage from "./pages/ReportsPage";
import "./App.css";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/assets" element={<Layout><AssetDirectory /></Layout>} />
        <Route path="/allocation" element={<Layout><AllocationPage /></Layout>} />
        <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
        <Route path="/maintenance" element={<Layout><MaintenancePage /></Layout>} />
        <Route path="/audit" element={<Layout><AuditPage /></Layout>} />
        <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;