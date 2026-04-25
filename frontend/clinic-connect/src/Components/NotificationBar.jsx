import * as React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Badge,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Close,
  Notifications,
  CalendarToday,
  Biotech,
  Email,
} from "@mui/icons-material";
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import styles from "../Style/NotificationBar.module.css";
import { useContext, useEffect } from "react";
import { NotificationsContext } from "../Context/NotificationsContext";
// Mock notification data
// const notifications = [
//   {
//     id: 1,
//     type: "appointment",
//     icon: CalendarToday,
//     title: "Appointment Reminder",
//     message: "You have an appointment with Dr. Smith tomorrow at 10:00 AM",
//     time: "Wed",
//     read: false,
//   },
//   {
//     id: 2,
//     type: "prescription",
//     icon: LocalPharmacy,
//     title: "Prescription Ready",
//     message: "Your prescription is ready for pickup at the pharmacy",
//     time: "Tues",
//     read: true,
//   },
//   {
//     id: 3,
//     type: "lab",
//     icon: Biotech,
//     title: "Lab Results Available",
//     message: "Your recent lab test results are now available for review",
//     time: "Mon",
//     read: true,
//   },
//   {
//     id: 4,
//     type: "message",
//     icon: Email,
//     title: "New Message",
//     message: "Dr. Johnson has sent you a message regarding your treatment",
//     time: "Wed",
//     read: false,
//   },
//   {
//     id: 5,
//     type: "appointment",
//     icon: CalendarToday,
//     title: "Appointment Confirmed",
//     message: "Your appointment on Friday has been confirmed",
//     time: "Tues",
//     read: true,
//   },
//   {
//     id: 6,
//     type: "lab",
//     icon: Biotech,
//     title: "Lab Test Scheduled",
//     message: "Your lab test has been scheduled for next Monday at 9:00 AM",
//     time: "Mon",
//     read: true,
//   },
// ];

const iconColors = {
  appointment: "#3b82f6",
  pharmacy: "#53629e",
  lab: "#f59e0b",
  message: "#10b981",
};

const iconMap = {
  appointment: CalendarToday,
  pharmacy: LocalPharmacyIcon,
  lab: Biotech,
  message: Email,
};

export default function NotificationBar({ open, onClose }) {
  const { fetchNotifications, notifications } =
    useContext(NotificationsContext);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className={styles.drawerPaper}
      style={{
        right: 0,
        left: "auto",
      }}
    >
      <Box className={styles.notificationContainer}>
        {/* Header */}
        <Box className={styles.header}>
          <Box className={styles.headerTitle}>
            <Notifications className={styles.headerIcon} />
            <Typography
              variant="h6"
              className={styles.title}
              sx={{ fontFamily: " Alan Sans, Outfit" }}
            >
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="error"
                className={styles.badge}
              />
            )}
          </Box>
          <IconButton onClick={onClose} className={styles.closeButton}>
            <Close />
          </IconButton>
        </Box>

        <Divider />

        {/* Notification List */}
        <Box className={styles.notificationList}>
          {notifications.map((notification) => {
            const IconComponent = iconMap[notification.type] ?? Notifications;
            return (
              <Box
                key={notification.notification_id}
                className={`${styles.notificationItem} ${
                  !notification.is_read ? styles.unread : ""
                }`}
              >
                <Box className={styles.notificationContent}>
                  <Box
                    className={styles.iconWrapper}
                    style={{
                      backgroundColor: `${iconColors[notification.type]}20`,
                    }}
                  >
                    <IconComponent
                      className={styles.notificationIcon}
                      style={{ color: iconColors[notification.type] }}
                    />
                  </Box>
                  <Box className={styles.textContent}>
                    <Box className={styles.titleRow}>
                      <Typography
                        variant="body1"
                        className={styles.notificationTitle}
                        sx={{ fontFamily: " Alan Sans, Outfit" }}
                      >
                        {notification.type}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={styles.time}
                        sx={{ fontFamily: " Alan Sans, Outfit" }}
                      >
                        {notification.date
                          ? notification.date.split("T")[0]
                          : "—"}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      className={styles.message}
                      sx={{ fontFamily: " Alan Sans, Outfit" }}
                    >
                      {notification.content}
                    </Typography>
                  </Box>
                </Box>
                {!notification.is_read && <Box className={styles.unreadDot} />}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
}
