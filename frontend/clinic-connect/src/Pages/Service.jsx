import { useState, useMemo, useContext, useEffect } from "react";

import { DoctorCard } from "../Components/Patient's Components/DoctorCard";

import { SpecialtyFilter } from "../Components/Patient's Components/SpecialtyFilter";

import { Users, Sparkles } from "lucide-react";

import styles from "../Style/Profile.module.css";

import MainLayout from "../Components/MainLayout";

import { useNavigate, useParams } from "react-router-dom";

import HomeStyle from "../Style/Home.module.css";

import {
  mockUsers,
  pharmacies,
  labs,
  doctors,
  specialtiesMap,
  userTypeLabels,
  mockConversations,
} from "../MockInfo";

import { Box, CircularProgress, Container, Typography } from "@mui/material";

import { UserTypeFilter } from "../Components/Patient's Components/UserTypeFilter";

import { PharmacyCard } from "../Components/Patient's Components/PharmacyCard";

import { LabCard } from "../Components/Patient's Components/LabCard";

import { ChatSideBar } from "../Components/Patient's Components/ChatSideBar";

import { DoctorsContext } from "../Context/DoctorsContext";

import { ServicesContext } from "../Context/ServicesContext";

import Progress from "../Components/Patient's Components/Progress";

import { BriefcaseMedical } from "lucide-react";
import { AuthContext } from "../Context/AuthProviderContext";

export default function Home({}) {
  const { Cat } = useParams();

  const [userRole] = useState("patient");

  const [activeItem, setActiveItem] = useState("/Services");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const [selectedUserType, setSelectedUserType] = useState(
    `${Cat ? Cat : "doctors"}`,
  );

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const handleItemClick = (href) => {
    if (href === "/" || href === "/logout") {
      navigate("/");

      return;
    }

    setActiveItem(href);

    setSidebarOpen(false);

    navigate(href);
  };

  const specialties = [
    "Cardiology",

    "Dermatology",

    "Neurology",

    "Orthopedics",

    "Pediatrics",

    "General Medicine",

    "Psychiatry",

    "Ophthalmology",
  ];

  const {
    doctors,

    doctor,

    fetchDoctors,

    fetchDoctor,

    // Pharmacies

    pharmacies,

    fetchPharmacies,

    // Labs

    labs,

    fetchLabs,

    // Shared

    loading,

    error,
  } = useContext(ServicesContext);

  useEffect(() => {
    fetchDoctors();

    fetchPharmacies();

    fetchLabs();
  }, []);

  // const { pharmacies, fetchPharmacies } = useContext(PharmaciesContext);

  // useEffect(() => { fetchPharmacies(); }, [])

  const currentData = useMemo(() => {
    switch (selectedUserType) {
      case "pharmacies":
        return pharmacies || [];

      case "labs":
        return labs || [];

      default:
        return doctors || [];
    }
  }, [selectedUserType, doctors]);

  const currentSpecialties = specialtiesMap[selectedUserType];

  const filteredItems = useMemo(() => {
    if (!currentData || !Array.isArray(currentData)) {
      return [];
    }

    return currentData.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialization?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "All" ||
        item.specialization?.toLowerCase() ===
          selectedSpecialty.toLocaleLowerCase();

      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty, currentData, selectedUserType]);

  const availableCount = filteredItems.filter((d) => d.available).length;

  const typeInfo = userTypeLabels[selectedUserType];

  // Reset specialty filter when user type changes

  const handleUserTypeChange = (newType) => {
    setSelectedUserType(newType);
    setSelectedSpecialty("All");
  };

  // Messages

  const [chatOpen, setChatOpen] = useState(false);

  const [conversations, setConversations] = useState(mockConversations);

  const [id, setId] = useState(null);

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

  const HandleClickMessage = (id) => {
    setId(id);

    setChatOpen(true);
  };

  const NewChat = (newChat) => {
    setConversations((prev) => [...prev, newChat]);
  };

  // console.log(labs);

  return (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      onSearch={setSearchQuery}
      active={activeItem}
      userRole={userRole}
      userName={user?.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <div className={styles.mainContent}>
        <Container maxWidth={false} disableGutters>
          {/* Hero Section */}
          <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 pt-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles
                className="w-5 h-5 "
                style={{ color: "hsl(225, 50%, 55%)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "hsl(225, 50%, 55%)", fontSize: "16px" }}
              >
                Find Your Perfect Doctor, Pharmacist and Lab Technician today!
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
              Your Gateway to{" "}
              <span
                style={{
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(135deg, hsl(225, 50%, 55%) 0%, hsl(190, 60%, 45%) 100%)",
                }}
              >
                HealthCare
              </span>{" "}
              in Egypt
            </h1>

            <p className="text-muted-foreground max-w-xl">
              Browse our network of qualified healthcare professionals and book
              appointments with ease.
            </p>
          </div>

          {/* User Type Filter */}

          <div
            className={`${styles.userTypeFilterSection} mb-3 p-3  rounded-3xl `}
          >
            <Typography className={`${styles.userTypeTitle} pb-2`}>
              <span className={styles.userTypeFilterTitle}>
                {" "}
                Browse by Category
              </span>
            </Typography>

            <div className={styles.filterWrapper}>
              <UserTypeFilter
                selected={selectedUserType}
                onSelect={handleUserTypeChange}
              />

              {/* Stats */}

              <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                  <Users
                    className={styles.statIcon}
                    style={{
                      display: "inline-block",
                      color: "hsl(225, 50%, 55%)",
                    }}
                  />

                  <span className={styles.statText}>
                    <span className={styles.statValue}>
                      {filteredItems.length}
                    </span>

                    <span className={styles.statLabel}>
                      {" "}
                      {filteredItems.length === 1
                        ? typeInfo.singular
                        : typeInfo.plural}{" "}
                      found
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specialty Filter */}

          {selectedUserType === "doctors" && (
            <div
              className={styles.filterSection}
              style={{ margin: "10px 16px " }}
            >
              <div className={styles.filterTitle}>Filter by Specialty</div>

              <SpecialtyFilter
                specialties={specialties}
                selected={selectedSpecialty}
                onSelect={setSelectedSpecialty}
              />
            </div>
          )}

          {/* Doctors / Pharmacies / Labs Grid */}

          {loading ? (
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
          ) : (
            <div>
              {filteredItems.length > 0 ? (
                <div className={HomeStyle.doctorsGrid}>
                  {filteredItems.map((Item, index) => (
                    <div
                      key={Item.national_id}
                      className={HomeStyle.doctorCardWrapper}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {selectedUserType === "doctors" && (
                        <DoctorCard
                          key={Item.national_id}
                          HandleClickMessage={HandleClickMessage}
                          doctor={Item}
                        />
                      )}

                      {selectedUserType === "pharmacies" && (
                        <PharmacyCard
                          key={Item.national_id}
                          HandleClickMessage={HandleClickMessage}
                          Pharmacy={Item}
                        />
                      )}

                      {selectedUserType === "labs" && (
                        <LabCard
                          key={Item.national_id}
                          HandleClickMessage={HandleClickMessage}
                          lab={Item}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : error ? (
                <Error />
              ) : (
                <div className={HomeStyle.emptyState}>
                  <div className={HomeStyle.emptyIcon}>
                    <Users className={HomeStyle.emptyIconSvg} />
                  </div>

                  <h3 className={HomeStyle.emptyTitle}>
                    No {selectedUserType} found
                  </h3>

                  <p className={HomeStyle.emptyText}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </Container>
      </div>

      <ChatSideBar
        open={chatOpen}
        onClose={() => {
          setId(false);
          setChatOpen(false);
        }}
        conversations={conversations}
        onSendMessage={handleSendMessage}
        initialConversationId={id}
        PL={
          selectedUserType === "doctors"
            ? 2
            : selectedUserType === "pharmacies"
              ? 1
              : selectedUserType === "labs"
                ? 0
                : null
        }
        NewChat={NewChat}
      />
    </MainLayout>
  );
}
