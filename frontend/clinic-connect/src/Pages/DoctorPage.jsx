import { useState, useCallback, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ProfileSidebar from "../Components/ProfileSidebar";
import ProfileHeader from "../Components/ProfileHeader";
import {
  CalendarToday,
  Description,
  Schedule,
  LocalActivity,
} from "@mui/icons-material";

import style from "../Style/DoctorPage.module.css";
import { AuthContext } from "../Context/AuthProviderContext";

function DoctorPage() {
  const { user, logout } = useContext(AuthContext);

  console.log(user);
  const [activeItem, setActiveItem] = useState("/patients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleItemClick = (href) => {
    if (href === "/") {
      navigate("/");
      return;
    }
    if (href === "/logout") {
      logout();
      navigate("/");
      return;
    }
    if (href === "/Settings") {
      navigate("/Settings");
      return;
    }

    console.log(href);
    setActiveItem(href);
    navigate("/Doctor" + href);
    setSidebarOpen(false);
  };

  const handleSearchValue = useCallback((value) => {
    setSearchValue(value);
    console.log("Search Value:", value);
  }, []);

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
          userRole={"doctor"}
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
          <div className={style.welcomeSection}>
            <h1 className={style.welcomeTitle}>
              Welcome back,{" "}
              <span className={style.welcomeName}>
                DR. {user?.name.split(" ")[0]}
              </span>
            </h1>
            <p className={style.welcomeSubtitle}>
              Here's what's happening with your healthcare today.
            </p>
          </div>

          <Outlet context={{ searchValue }} />
        </main>
      </div>
    </div>
  );
}

export default DoctorPage;
