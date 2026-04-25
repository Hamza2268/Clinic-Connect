import { useContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Chip,
  Typography,
  Box,
  Avatar,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  MapPin,
  Calendar,
  Pill,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockUsers, mockOrders, statusConfig } from "../MockInfo";
import styles from "../Style/Orders.module.css";
import MainLayout from "../Components/MainLayout";
import { MedicalInformation } from "@mui/icons-material";
import { MedicalOrderContext } from "../Context/MedicalOrderContext";
import Progress from "../Components/Patient's Components/Progress";
import { AuthContext } from "../Context/AuthProviderContext";

export default function Orders() {
  const [userRole] = useState("patient");
  const [activeItem, setActiveItem] = useState("/orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const statusConfig = {
    requested: {
      label: "Pending",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      icon: Clock,
    },
    ready_for_pickup: {
      label: "Ready for Pickup",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      icon: CheckCircle,
    },
    completed: {
      label: "Picked Up",
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
      icon: Package,
    },
    cancelled: {
      label: "Cancelled",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      icon: XCircle,
    },
  };

  const handleItemClick = (href) => {
    if (href === "/" || href === "/logout") {
      navigate("/");
      return;
    }
    setActiveItem(href);
    setSidebarOpen(false);
    navigate(href);
  };

  const { patientMedicalOrders, fetchPatientMedicalOrders, loading, error } =
    useContext(MedicalOrderContext);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchPatientMedicalOrders().finally(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (!patientMedicalOrders) return;

    setFilteredOrders(
      selectedTab === "all"
        ? patientMedicalOrders
        : patientMedicalOrders.filter((order) => order.status === selectedTab),
    );
  }, [selectedTab, patientMedicalOrders]);

  const counts = {
    all: patientMedicalOrders?.length,
    pending: patientMedicalOrders?.filter((o) => o.status === "requested")
      .length,
    ready: patientMedicalOrders?.filter((o) => o.status === "ready_for_pickup")
      .length,
    taken: patientMedicalOrders?.filter((o) => o.status === "completed").length,
    cancelled: patientMedicalOrders?.filter((o) => o.status === "cancelled")
      .length,
  };

  return loading || !initialized ? (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      active={activeItem}
      userRole={userRole}
      userName={user.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <Box className="!h-full  " sx={{ display: "flex" }}>
        <CircularProgress className="m-auto" />
      </Box>
    </MainLayout>
  ) : error ? (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      active={activeItem}
      userRole={userRole}
      userName={user.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <Error />
    </MainLayout>
  ) : (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      active={activeItem}
      userRole={userRole}
      userName={user.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <ShoppingBag className={styles.headerIconSvg} />
            </div>
            <div>
              <h1 className={styles.pageTitle}>My Orders</h1>
              <p className={styles.pageSubtitle}>
                Track and manage your pharmacy orders
              </p>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <Box className={styles.tabsContainer}>
          <Tabs
            value={selectedTab}
            onChange={(e, val) => setSelectedTab(val)}
            variant="scrollable"
            scrollButtons={window.innerWidth < 1000 ? "auto" : "none"}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                minHeight: 48,
                borderRadius: "12px",
                mx: 0.5,
                "&.Mui-selected": {
                  color: "#1976d2",
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab
              value="all"
              label={
                <Box className={styles.tabLabel}>
                  <span>All Orders</span>
                  <Chip
                    label={counts.all}
                    size="small"
                    className={styles.tabChip}
                  />
                </Box>
              }
            />
            <Tab
              value="requested"
              label={
                <Box className={styles.tabLabel}>
                  <Clock size={16} />
                  <span>Pending</span>
                  <Chip
                    label={counts.pending}
                    size="small"
                    className={styles.tabChipPending}
                  />
                </Box>
              }
            />
            <Tab
              value="ready_for_pickup"
              label={
                <Box className={styles.tabLabel}>
                  <CheckCircle size={16} />
                  <span>Ready</span>
                  <Chip
                    label={counts.ready}
                    size="small"
                    className={styles.tabChipReady}
                  />
                </Box>
              }
            />
            <Tab
              value="completed"
              label={
                <Box className={styles.tabLabel}>
                  <Package size={16} />
                  <span>Picked Up</span>
                  <Chip
                    label={counts.taken}
                    size="small"
                    className={styles.tabChipTaken}
                  />
                </Box>
              }
            />
            <Tab
              value="cancelled"
              label={
                <Box className={styles.tabLabel}>
                  <XCircle size={16} />
                  <span>Cancelled</span>
                  <Chip
                    label={counts.cancelled}
                    size="small"
                    className={styles.tabChipCancelled}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Orders List */}
        <div className={styles.ordersList}>
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No orders found</h3>
              <p className={styles.emptyText}>
                You don't have any orders in this category
              </p>
            </div>
          ) : (
            filteredOrders?.map((order, index) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <Card
                  key={order.order_id}
                  className={styles.orderCard}
                  sx={{
                    borderRadius: "16px",
                    animation: `fadeInUp 0.3s ease ${index * 0.05}s both`,
                  }}
                >
                  <CardContent className={styles.orderCardContent}>
                    {/* Order Header */}
                    <div className={styles.orderHeader}>
                      <div className={styles.pharmacyInfo}>
                        <Avatar
                          // src={order.pharmacy_name}
                          className={styles.pharmacyAvatar}
                        />
                        <div>
                          <Typography className={styles.pharmacyName}>
                            {order.pharmacy_name}
                          </Typography>
                          <div className={styles.pharmacyLocation}>
                            <MapPin size={12} />
                            <span>{order.address}</span>
                          </div>
                        </div>
                      </div>
                      <Chip
                        icon={<StatusIcon size={14} />}
                        label={status.label}
                        size="small"
                        sx={{
                          backgroundColor: status.bgColor,
                          color: status.color,
                          fontWeight: 600,
                          "& .MuiChip-icon": {
                            color: status.color,
                          },
                        }}
                      />
                    </div>

                    <Divider className={styles.divider} />

                    {/* Order Items */}
                    <div className={styles.orderItems}>
                      {order?.items?.map((item, idx) => (
                        <div key={idx} className={styles.orderItem}>
                          <div className={styles.itemIcon}>
                            <Pill size={16} />
                          </div>
                          <div className={styles.itemDetails}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemDosage}>
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Divider className={styles.divider} />

                    {/* Order Footer */}
                    <div className={styles.orderFooter}>
                      <div className={styles.orderMeta}>
                        <div className={styles.metaItem}>
                          <Calendar size={14} />
                          <span>Ordered: {order.order_date.split("T")[0]}</span>
                        </div>
                      </div>
                      <div className={styles.orderTotal}>
                        <span className={styles.totalLabel}>Total:</span>
                        <span className={styles.totalAmount}>
                          ${order.total_price}
                        </span>
                      </div>
                    </div>

                    {/* Status specific info */}
                    {/* {order.status === 'ready' && (
                                                        <div className={styles.statusInfo + ' ' + styles.statusReady}>
                                                            <CheckCircle size={16} />
                                                            <span>Ready since {order.pickup_date}</span>
                                                        </div>
                                                    )}
                                                    {order.status === 'pending' && (
                                                        <div className={styles.statusInfo + ' ' + styles.statusPending}>
                                                            <Clock size={16} />
                                                            <span>Estimated ready: {order.pickup_date}</span>
                                                        </div>
                                                    )} */}
                    {order.status === "completed" && (
                      <div
                        className={styles.statusInfo + " " + styles.statusTaken}
                      >
                        <Package size={16} />
                        <span>
                          Picked up on {order.pickup_date?.split("T")[0]}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
