import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Box } from "lucide-react";
import { CircularProgress, Button } from "@mui/material";
import MainLayout from "../Components/MainLayout.jsx";
import { LabContext } from "../Context/LabProvider.jsx";
import { LabInfo } from "../Components/Patient's Components/LabInfo.jsx";
import { LabActions } from "../Components/Patient's Components/LabActions.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LabProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { labTechnician, loading, fetchLabTechnician } = useContext(LabContext);

  const [activeItem, setActiveItem] = useState("/Services");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

  const labTests = [];
  const availableTests = [];

  useEffect(() => {
    fetchLabTechnician(id);
  }, [id]);

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
        conv.id === conversationId
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
        userRole="patient"
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

  if (!labTechnician) {
    return (
      <MainLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        active={activeItem}
        userRole="patient"
        activeItem={activeItem}
        onItemClick={handleItemClick}
        expanded={sidebarOpen}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Lab not found</p>
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
      userRole="patient"
      userName={labTechnician.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/Services/labs")}
          className="gap-2 text-muted-foreground hover:text-foreground "
          style={{ fontFamily: " Alan Sans, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Labs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LabInfo
            Lab={labTechnician}
            conversations={conversations}
            labTests={labTests}
            availableTests={availableTests}
            labtechId={id}
            onSendMessage={handleSendMessage}
          />
          <LabActions Lab={labTechnician} />
        </div>
      </div>
    </MainLayout>
  );
}
