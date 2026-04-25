import { useContext, useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Search, FolderOpen } from "@mui/icons-material";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RecordCard } from "../Components/Patient's Components/RecordCard";
import { mockMedicalRecords, mockUsers } from "../MockInfo";
import MainLayout from "../Components/MainLayout";
import Progress from "../Components/Patient's Components/Progress";
import { MedicalRecordContext } from "../Context/MedicalRecordContext";
import { AuthContext } from "../Context/AuthProviderContext";

export default function MedicalRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [userRole] = useState("patient");
  const [activeItem, setActiveItem] = useState("/Records");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  // Settings state
  const userData = mockUsers[userRole];
  const handleItemClick = (href) => {
    if (href === "/" || href === "/logout") {
      navigate("/");
      return;
    }
    setActiveItem(href);
    setSidebarOpen(false);
    navigate(href);
  };

  // const statusCounts = {
  //     all: mockMedicalRecords.length,
  //     completed: mockMedicalRecords.filter((r) => r.status === 'completed').length,
  //     ongoing: mockMedicalRecords.filter((r) => r.status === 'ongoing').length,
  //     'in-progress': mockMedicalRecords.filter((r) => r.status === 'in-progress').length,
  // };

  // ... other imports
  const { patientMedicalRecords, fetchPatientMedicalRecords, loading, error } =
    useContext(MedicalRecordContext);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchPatientMedicalRecords().finally(() => setInitialized(true));
  }, []);

  const statusCounts = {
    all: patientMedicalRecords?.length,
  };

  const filteredRecords = useMemo(() => {
    if (!patientMedicalRecords || patientMedicalRecords.length === 0) return [];

    const query = searchQuery.trim().toLowerCase();

    if (!query) return patientMedicalRecords;

    return patientMedicalRecords.filter((record) => {
      const diagnosis = record.diagnose?.toLowerCase() || "";
      const doctorName = record.name?.toLowerCase() || "";
      const notes = record.notes?.toLowerCase() || "";
      const treatment_plan = record.treatment_plan?.toLowerCase() || "";

      return (
        doctorName.includes(query) ||
        diagnosis.includes(query) ||
        notes.includes(query) ||
        treatment_plan.includes(query)
      );
    });
  }, [patientMedicalRecords, searchQuery]); // Recalculate only when records or query change

  return loading || !initialized ? (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      active={activeItem}
      onNotificationClick={() => {}}
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
      // onSearch={() => { }}
      onNotificationClick={() => {}}
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
      // onSearch={() => { }}
      onNotificationClick={() => {}}
      userRole={userRole}
      userName={user.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <Box className="min-h-screen bg-background">
        {/* Header */}
        <Box className="bg-card sticky top-0 z-10">
          <Box className=" mx-auto px-4 py-4">
            <Box className="flex items-center gap-3 mb-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    My Medical Records
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    View and manage your medical history and records
                  </p>
                </div>
              </div>
            </Box>

            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search by diagnosis, doctor, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search style={{ color: "#888" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  backgroundColor: "#fff",

                  "& input": {
                    color: "#000",
                  },

                  "& fieldset": {
                    borderColor: "#ddd",
                  },

                  "&:hover fieldset": {
                    borderColor: "#5A78C9",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#5A78C9",
                  },

                  "& input::placeholder": {
                    color: "#aaa",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box className=" mx-auto px-4 py-6">
          {patientMedicalRecords.length > 0 ? (
            <Box className="space-y-4">
              {filteredRecords.map((record) => (
                <RecordCard key={record.record_id} record={record} />
              ))}
            </Box>
          ) : (
            <Box className="text-center py-12">
              <FolderOpen
                className="text-muted-foreground mx-auto mb-4"
                style={{ fontSize: 48 }}
              />
              <Typography className="text-muted-foreground">
                No medical records found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}
