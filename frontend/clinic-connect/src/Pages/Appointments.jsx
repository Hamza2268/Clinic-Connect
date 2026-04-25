import { useState, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockConversations } from "../MockInfo";
import {
  CalendarToday,
  Description,
  Schedule,
  LocalActivity,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
} from "@mui/material";
import { Appointments } from "../Components/Patient's Components/Appointments";
import MainLayout from "../Components/MainLayout";
import { AppointmentsContext } from "../Context/AppointmentsContext";
import { AuthContext } from "../Context/AuthProviderContext";


const quickActions = {
  patient: [
    { icon: CalendarToday, label: "Book Appointment", color: "primary", href: '/Home' },
    { icon: Description, label: "Orders", color: "info", href: '/Orders' },
    { icon: LocalActivity, label: "Health Summary", color: "secondary", href: '/Records' },
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


export default function AppointmentsPage() {
  const [userRole, setUserRole] = useState("patient");
  const [activeItem, setActiveItem] = useState("/Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ShowNotifications, setShowNotifications] = useState(false);

  const [conversations, setConversations] = useState(mockConversations);
  const [chatOpen, setChatOpen] = useState(false);

  const handleSendMessage = (conversationId, content) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      content,
      timestamp: new Date(),
      isRead: true,
    };

    setConversations(prev =>
      prev.map(conv =>
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

  // const userData = mockUsers[userRole];
      const { user } = useContext(AuthContext);
  
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

  const { patientAppointments, loading, error, fetchPatientAppointments } = useContext(AppointmentsContext)
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchPatientAppointments().finally(() => setInitialized(true));
  }, []);
  // console.log("appoints are : ", patientAppointments);

  return (
    (loading || !initialized) ?
      <MainLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={setSearchQuery}
        active={activeItem}
        userRole={userRole}
        userName={user.name}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        expanded={sidebarOpen}
      >
        <Box className="!h-full  " sx={{ display: 'flex' }}>
          <CircularProgress className="m-auto" />
        </Box>
      </MainLayout>
      :
      <MainLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        active={activeItem}
        // onSearch={() => { }}
        onNotificationClick={() => { }}
        userRole={userRole}
        userName={user.name}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        expanded={sidebarOpen}
      >

        < Appointments appointments={patientAppointments.data || []} />


      </MainLayout>
  );
};

// export default Profile;
