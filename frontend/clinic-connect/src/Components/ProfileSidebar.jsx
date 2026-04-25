import {
  CalendarToday,
  Description,
  Message,
  Assignment,
  LocalPharmacy,
  Biotech,
  People,
  Inventory,
  Upload,
  Schedule,
  LocalHospital,
  Person,
  Settings,
  Logout,
  Home,
} from "@mui/icons-material";
import { PillBottle } from "lucide-react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import styles from "../Style/Profile.module.css";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthProviderContext";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
const roleConfig = {
  patient: {
    color: "#5A78C9",
    items: [
      { icon: MedicalServicesIcon, label: "Services", href: "/Services" },
      { icon: CalendarToday, label: "My Appointments", href: "/Appointments" },
      { icon: LocalPharmacy, label: "Prescriptions", href: "/prescriptions" },
      { icon: Biotech, label: "Lab Results", href: "/LabTests" },
      { icon: Description, label: "Medical Records", href: "/Records" },
      { icon: PillBottle, label: "Orders", href: "/Orders" },
      { icon: Message, label: "Messages", href: "/messages" },
    ],
  },
  doctor: {
    color: "#53629e",
    items: [
      { icon: People, label: "My Patients", href: "/patients" },
      { icon: CalendarToday, label: "Appointments", href: "/appointments" },
      {
        icon: CalendarMonthIcon,
        label: "Shift Schedule",
        href: "/shiftSchedule",
      },
      { icon: Message, label: "Messages", href: "/messages" },
    ],
  },
  pharmacist: {
    color: "#76BFBB",
    items: [
      { icon: LocalPharmacy, label: "Prescriptions", href: "/prescriptions" },
      { icon: Inventory, label: "Inventory", href: "/inventory" },
      { icon: People, label: "Patients", href: "/patients" },
      { icon: Message, label: "Messages", href: "/messages" },
    ],
  },
  lab_technician: {
    color: "#a8aed1",
    items: [
      { icon: Assignment, label: "Test Requests", href: "/requests" },
      { icon: People, label: "Patients", href: "/patients" },
      { icon: Inventory, label: "Inventory", href: "/inventory" },
      { icon: Message, label: "Messages", href: "/messages" },
    ],
  },
};

const roleLabels = {
  patient: "Patient",
  doctor: "Doctor",
  pharmacist: "Pharmacist",
  lab_technician: "Lab Technician",
};

const roleIcons = {
  patient: Person,
  doctor: LocalHospital,
  pharmacist: LocalPharmacy,
  lab_technician: Biotech,
};

const ProfileSidebar = ({
  userRole,
  userName,
  activeItem,
  onItemClick,
  expanded = true,
  handleOpenChat,
}) => {
  const { user } = useContext(AuthContext);
  const config = roleConfig[userRole];
  const RoleIcon = roleIcons[userRole];
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const basePath = (pathname.split("/")[1] || "").toLocaleLowerCase();
  const [chatOpen, setChatOpen] = useState(false);

  // console.log(basePath);

  const asideClass = `${styles.sidebar} ${
    expanded ? styles.sidebarExpanded : styles.sidebarCollapsed
  }`;

  return (
    <>
      <aside className={asideClass}>
        {/* User Info Section */}
        <div className={styles.userInfo}>
          <div className={styles.userInfoContent}>
            <div className={styles.LogoIcon}>
              <Diversity2Icon style={{ color: "white", fontSize: 30 }} />
            </div>
            <div className={styles.userDetails}>
              {expanded ? (
                <>
                  <h3 className={styles.userName}>{userName}</h3>
                  <span
                    className={styles.userRole}
                    style={{ color: config.color }}
                  >
                    {roleLabels[userRole]}
                  </span>
                </>
              ) : (
                <div className={styles.collapsedRoleWrapper}>
                  <span
                    className={styles.userRole}
                    style={{ color: config.color }}
                  >
                    {roleLabels[userRole]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className={styles.navigation}>
          <div className={styles.navList}>
            {config.items.map((item) => {
              const ItemIcon = item.icon;
              const target = (item.href || "").toLowerCase().replace(/^\//, "");
              const isActive = pathname.split("/").includes(target);
              return (
                <button
                  key={item.href}
                  onClick={
                    item.href === "/messages"
                      ? handleOpenChat
                      : () => onItemClick?.(item.href)
                  }
                  className={`${styles.navItem} ${
                    isActive ? styles.navItemActive : ""
                  }`}
                  style={isActive ? { backgroundColor: config.color } : {}}
                >
                  <ItemIcon
                    // style={ `${basePath==="/Order" ? :}`}
                    className={`${styles.navIcon} ${
                      ItemIcon === PillBottle ? " !w-6 !h-6" : ""
                    } `}
                  />

                  <span className={styles.navLabel}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          <button
            onClick={() => onItemClick?.("/Settings")}
            className={`${styles.actionButton}  ${
              basePath === "settings" ? styles.navItemActive : ""
            }`}
            style={
              basePath === "settings" ? { backgroundColor: config.color } : {}
            }
          >
            <Settings className={`${styles.actionIcon} ${styles.navIcon}`} />
            <span className={styles.actionLabel}>Settings</span>
          </button>

          <button
            onClick={() => onItemClick?.("/logout")}
            className={`${styles.actionButton} ${styles.logoutButton}`}
          >
            <Logout className={styles.actionIcon} />
            <span className={styles.actionLabel}>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
