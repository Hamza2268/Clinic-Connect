import style from "../Style/Pharmacist.module.css";
import { useState, useCallback, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ProfileSidebar from "../Components/ProfileSidebar";
import ProfileHeader from "../Components/ProfileHeader";
import { PillBottle } from "lucide-react";
import { AuthContext } from "../Context/AuthProviderContext";

function Pharmacist() {
  const [userRole, setUserRole] = useState("pharmacist");
  const [activeItem, setActiveItem] = useState("/prescriptions");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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
    navigate("/pharmacist" + href);
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
          userRole={user?.role}
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
              <PillBottle size={38} />
              <h1 className={style.welcomeTitle}>
                Welcome back,{" "}
                <span className={style.welcomeName}>
                  {user?.name.split(" ")[0]}
                </span>
              </h1>
            </div>
            <p className={style.welcomeSubtitle}>
              Here's what's happening with {user?.pharmacy_name} today.
            </p>
          </div>

          {/* Nested Routes - Pass searchValue via context */}
          <Outlet context={{ searchValue }} />
        </main>
      </div>
    </div>
  );
}

export default Pharmacist;
