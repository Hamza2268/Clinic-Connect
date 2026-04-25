import { useState, useCallback, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ProfileSidebar from "../Components/ProfileSidebar";
import ProfileHeader from "../Components/ProfileHeader";
import {
  CalendarToday,
  Description,
  Schedule,
  TrendingUp,
  ChevronRight,
  LocalActivity,
} from "@mui/icons-material";

import { PillBottle } from "lucide-react";
import style from "../Style/LabTechnician.module.css";
import { AuthContext } from "../Context/AuthProviderContext";
const mockUsers = {
  patient: {
    name: "Sarah Johnson",
    stats: [
      { label: "Upcoming Appointments", value: "2", trend: "+1" },
      { label: "Active Prescriptions", value: "3" },
      { label: "Pending Lab Results", value: "1" },
      { label: "Unread Messages", value: "4", trend: "+2" },
    ],
  },
  doctor: {
    name: "Michael Chen",
    stats: [
      { label: "Today's Patients", value: "8" },
      { label: "Pending Reviews", value: "5", trend: "+3" },
      { label: "Lab Requests Sent", value: "12" },
      { label: "Messages", value: "7", trend: "+4" },
    ],
  },
  pharmacist: {
    name: "Emily Rodriguez",
    stats: [
      { label: "Prescriptions Today", value: "24" },
      { label: "Low Stock Items", value: "6", trend: "-2" },
      { label: "Pending Orders", value: "8" },
      { label: "Customer Messages", value: "3" },
    ],
  },
  lab_technician: {
    name: "James Wilson",
    stats: [
      { label: "Pending Tests", value: "15" },
      { label: "Samples Today", value: "22" },
      { label: "Results to Upload", value: "7", trend: "+5" },
      { label: "Equipment Alerts", value: "1" },
    ],
  },
};

function LabTechnician() {
  const [userRole, setUserRole] = useState("lab_technician");
  const [activeItem, setActiveItem] = useState("/requests");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userData = mockUsers[userRole];

  const [searchValue, setSearchValue] = useState("");

  const handleItemClick = (href) => {
    if (href === "/") {
      navigate("/");
      return;
    }
    if (href === "/logout") {
      navigate("/");
      return;
    }
    if (href === "/Settings") {
      navigate("/Settings");
      return;
    }
    setActiveItem(href);
    navigate("/labTechnician" + href);
    setSidebarOpen(false);
  };

  const handleSearchValue = useCallback((value) => {
    setSearchValue(value);
    console.log("Search Value:", value);
  }, []);

  console.log(user);
  return (
    <div className={style.profileContainer}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className={style.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${style.sidebarWrapper} ${sidebarOpen ? style.open : ""}`}
      >
        <ProfileSidebar
          userRole={"lab_technician"}
          userName={user?.name}
          activeItem={activeItem}
          onItemClick={handleItemClick}
          expanded={sidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className={style.mainContent}>
        <ProfileHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSearch={handleSearchValue}
        />

        <main className={style.mainSection}>
          {/* Welcome Section - Always Visible */}
          <div className={style.welcomeSection}>
            <div className={style.welcomeIcon}>
              <h1 className={style.welcomeTitle}>
                Welcome back,{" "}
                <span className={style.welcomeName}>
                  {user?.name?.split(" ")[0]}
                </span>
              </h1>
            </div>
            <p className={style.welcomeSubtitle}>
              Here's what's happening with {user?.lab_name} today.
            </p>
          </div>

          {/* Nested Routes - Pass searchValue via context */}
          <Outlet context={{ searchValue }} />
        </main>
      </div>
    </div>
  );
}

export default LabTechnician;
