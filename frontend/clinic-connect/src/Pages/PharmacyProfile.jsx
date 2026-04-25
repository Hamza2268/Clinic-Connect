import { useNavigate, useParams } from "react-router-dom";
import {
  mockUsers,
  pharmacies,
  prescriptions,
  mockMedications,
  mockConversations,
} from "../MockInfo";
import { ArrowLeft } from "lucide-react";
import { Button, CircularProgress } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import MainLayout from "../Components/MainLayout";
import { PharmacyInfo } from "../Components/Patient's Components/PharmacyInfo";
import { PharmacySchedule } from "../Components/Patient's Components/PharmacySchedule";
import { PharmacyContext } from "../Context/PharmacyProvider";

export default function PharmacyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPharmacistProfile, pharmacist, loading, pharmacistError } =
    useContext(PharmacyContext);

  const [userRole] = useState("patient");
  const [activeItem, setActiveItem] = useState("/Services");
  const [conversations, setConversations] = useState(mockConversations);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Settings state
  const userData = mockUsers[userRole];

  useEffect(() => {
    if (id) {
      getPharmacistProfile(id);
    }
  }, [id]);

  const Pharmacy = pharmacist;
  const handleItemClick = (href) => {
    if (href === "/" || href === "/logout") {
      navigate("/");
      return;
    }
    setActiveItem(href);
    setSidebarOpen(false);
    navigate(href);
  };

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
          : conv,
      ),
    );
  };

  if (loading) {
    return (
      <MainLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        active={activeItem}
        onSearch={() => {}}
        onNotificationClick={() => {}}
        userRole={userRole}
        userName={userData.name}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        expanded={sidebarOpen}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          <CircularProgress style={{ color: "#53629e" }} />
          <div
            style={{
              marginTop: "16px",
              color: "#53629e",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            Loading, please wait...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (pharmacistError || !Pharmacy) {
    return (
      <MainLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        active={activeItem}
        onSearch={() => {}}
        onNotificationClick={() => {}}
        userRole={userRole}
        userName={userData.name}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        expanded={sidebarOpen}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            {pharmacistError || "Pharmacy not found"}
          </p>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      active={activeItem}
      onSearch={() => {}}
      onNotificationClick={() => {}}
      userRole={userRole}
      userName={userData.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/Services/pharmacies")}
          className="gap-2 text-muted-foreground hover:text-foreground "
          style={{ fontFamily: " Alan Sans, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pharmacies
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* pharmacy Info Card */}
          <PharmacyInfo
            Pharmacy={Pharmacy}
            prescriptions={prescriptions}
            medications={mockMedications}
            conversations={conversations}
            onSendMessage={handleSendMessage}
          />

          <PharmacySchedule Pharmacy={Pharmacy} />
        </div>
      </div>
    </MainLayout>
  );
}
