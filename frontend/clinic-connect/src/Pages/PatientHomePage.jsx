import { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { mockConversations } from "../MockInfo";
import {
  CalendarToday,
  Description,
  Schedule,
  TrendingUp,
  ChevronRight,
  LocalActivity,
} from "@mui/icons-material";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import style from "../Style/Profile.module.css";
import MainLayout from "../Components/MainLayout";
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
    name: "Dr. Michael Chen",
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

const quickActions = {
  patient: [
    {
      icon: CalendarToday,
      label: "Book Appointment",
      color: "primary",
      href: "/Appointments",
    },
    { icon: Description, label: "Orders", color: "info", href: "/Orders" },
    {
      icon: LocalActivity,
      label: "Health Summary",
      color: "secondary",
      href: "/Records",
    },
  ],
  doctor: [
    { icon: CalendarToday, label: "View Schedule", color: "info" },
    { icon: Description, label: "Write Prescription", color: "primary" },
    { icon: LocalActivity, label: "Patient Queue", color: "secondary" },
  ],
  pharmacist: [
    { icon: Description, label: "New Prescription", color: "secondary" },
    { icon: LocalActivity, label: "Check Inventory", color: "info" },
    { icon: Schedule, label: "Order Status", color: "primary" },
  ],
  lab_technician: [
    { icon: Description, label: "New Test Request", color: "warning" },
    { icon: LocalActivity, label: "Upload Results", color: "info" },
    { icon: Schedule, label: "Sample Schedule", color: "primary" },
  ],
};

export default function PatientHomePage() {
  const [userRole, setUserRole] = useState("patient");
  const [activeItem, setActiveItem] = useState("/Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ShowNotifications, setShowNotifications] = useState(false);

  const [conversations, setConversations] = useState(mockConversations);
  const [chatOpen, setChatOpen] = useState(false);
  const { user, token } = useContext(AuthContext);
  console.log(user, token);

  const handleSendMessage = (conversationId, content) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: "user",
      content,
      timestamp: new Date(),
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id == conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : conv
      )
    );
  };
  const navigate = useNavigate();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    console.log("Search:", query);
  }, []);

  const userData = mockUsers[userRole];
  const actions = quickActions[userRole];

  const handleItemClick = (href) => {
    if (href === "/" || href === "/logout") {
      navigate("/");
      return;
    }
    setActiveItem(href);
    setSidebarOpen(false);
    navigate(href);
  };

  return (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      active={activeItem}
      // onSearch={() => { }}
      onNotificationClick={() => {}}
      userRole={userRole}
      userName={userData.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      {/* Welcome Section */}
      <div className={style.welcomeSection}>
        <h1 className={style.welcomeTitle}>
          Welcome back,{" "}
          <span className={style.welcomeName}>{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className={style.welcomeSubtitle}>
          Here's what's happening with your care today.
        </p>
      </div>

      {/* Stats Grid */}
      <Grid container spacing={2} className={style.statsGrid}>
        {userData.stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.label}>
            <Card className={style.statCard}>
              <CardContent>
                <div className={style.statContent}>
                  <div>
                    <Typography
                      variant="body2"
                      className={style.statLabel}
                      sx={{ fontFamily: '"Alan Sans", sans-serif' }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      className={style.statValue}
                      sx={{ fontFamily: '"Alan Sans", sans-serif' }}
                    >
                      {stat.value}
                    </Typography>
                  </div>
                  {/* {stat.trend && (
                    <div
                      className={`${style.statTrend} ${
                        stat.trend.startsWith("+")
                          ? style.positive
                          : style.negative
                      }`}
                    >
                      <TrendingUp className={style.trendIcon} />
                      <Typography variant="caption" className={style.trendText}>
                        {stat.trend}
                      </Typography>
                    </div>
                  )} */}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <div className={style.quickActionsSection}>
        <Typography
          variant="h5"
          className={style.sectionTitle}
          sx={{ fontFamily: '"Alan Sans", sans-serif' }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Grid
                item
                xs={12}
                sm={4}
                key={action.label}
                onClick={() => navigate(action.href)}
              >
                <Card className={style.actionCard}>
                  <CardContent>
                    <div
                      className={`${style.actionIconWrapper} ${
                        style[action.color] || ""
                      }`}
                    >
                      <Icon />
                    </div>
                    <Typography
                      variant="h6"
                      className={style.actionTitle}
                      sx={{ fontFamily: '"Alan Sans", sans-serif' }}
                    >
                      {action.label}
                    </Typography>
                    <div className={style.actionFooter}>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: '"Alan Sans", sans-serif' }}
                      >
                        Get started
                      </Typography>
                      <ChevronRight className={style.actionArrow} />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </MainLayout>
  );
}
