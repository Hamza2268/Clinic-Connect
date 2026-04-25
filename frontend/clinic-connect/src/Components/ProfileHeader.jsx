import { Notifications, Search, Menu } from "@mui/icons-material";
import { IconButton, InputBase, Badge, Avatar } from "@mui/material";
import style from "../Style/Profile.module.css";
import NotificationBar from "../Components/NotificationBar";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProviderContext";

const ProfileHeader = ({
  onMenuClick,
  onSearch,
  active,
  onNotificationClick,
}) => {
  let SearchActive = active !== "/Settings";
  const [ShowNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // console.log("Active route:", active, "Show search:", active !== "/Settings");

  return (
    <>
      <header className={style.profileHeader}>
        <div className={style.headerLeft}>
          <button
            onClick={() => {
              navigate("/settings");
            }}
            className="flex items-center gap-3 !pl-0 rounded-xl hover:bg-[hsl(215,20%,94%)] transition-colors"
          ></button>
          <IconButton
            className={`${style.menuButton} !pl-0`}
            onClick={onMenuClick}
          >
            <Menu />
          </IconButton>

          <div className={style.logoSection}>
            <span className={style.logoText}>Clinic Connect</span>
          </div>
        </div>

        {/* Search */}
        {onSearch && (
          <div className={`${style.searchContainer} `}>
            <div className={`${style.searchWrapper} border-5 border-sky-500`}>
              <Search className={style.searchIcon} />
              <InputBase
                placeholder="Search..."
                className={style.searchInput}
                inputProps={{ "aria-label": "search" }}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={style.headerActions} onClick={onNotificationClick}>
          <IconButton
            className={style.notificationButton}
            onClick={() => setShowNotification(!ShowNotification)}
          >
            <Badge variant="dot" color="error" overlap="circular">
              <Notifications />
            </Badge>
          </IconButton>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#2f4078ff",
              fontFamily: "Alan Sans, sans-serif",
              fontWeight: 600,
            }}
            onClick={() => {
              navigate("/settings");
            }}
          >
            {user?.img ? (
              <img src={user?.img} alt="p" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </Avatar>
        </div>
      </header>
      <NotificationBar
        open={ShowNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default ProfileHeader;
