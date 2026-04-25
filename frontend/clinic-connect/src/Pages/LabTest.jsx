import MainLayout from "../Components/MainLayout.jsx";
import { Badge } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabTestDetails from "../Components/Patient's Components/LabTestDetails";
import LabTestSummary from "../Components/Patient's Components/LabTestSummary";
import { LabTestContext } from "../Context/LabTestContext.jsx";
import Progress from "../Components/Patient's Components/Progress.jsx";
import { Box, CircularProgress } from "@mui/material";
import { AuthContext } from "../Context/AuthProviderContext.jsx";
// const labTests = [
//     {
//         id: "1",
//         testName: "Complete Blood Count (CBC)",
//         category: "Hematology",
//         orderedBy: "Dr. Sarah Johnson",
//         orderedDate: "2024-12-05",
//         resultDate: "2024-12-07",
//         status: "completed",
//         results: [
//             { name: "White Blood Cells", value: "7.5", unit: "K/uL", reference: "4.5-11.0", status: "low" },
//             { name: "Red Blood Cells", value: "4.8", unit: "M/uL", reference: "4.5-5.5", status: "normal" },
//             { name: "Hemoglobin", value: "14.2", unit: "g/dL", reference: "13.5-17.5", status: "normal" },
//             { name: "Platelets", value: "180", unit: "K/uL", reference: "150-400", status: "normal" },
//         ],
//     },
//     {
//         id: "2",
//         testName: "Lipid Panel",
//         category: "Chemistry",
//         orderedBy: "Dr. Michael Chen",
//         orderedDate: "2024-12-08",
//         resultDate: "2024-12-10",
//         status: "completed",
//         results: [
//             { name: "Total Cholesterol", value: "220", unit: "mg/dL", reference: "<200", status: "high" },
//             { name: "LDL Cholesterol", value: "145", unit: "mg/dL", reference: "<100", status: "high" },
//             { name: "HDL Cholesterol", value: "55", unit: "mg/dL", reference: ">40", status: "normal" },
//             { name: "Triglycerides", value: "120", unit: "mg/dL", reference: "<150", status: "normal" },
//         ],
//     },
//     {
//         id: "3",
//         testName: "Thyroid Function Panel",
//         category: "Endocrinology",
//         orderedBy: "Dr. Emily Rodriguez",
//         orderedDate: "2024-12-10",
//         resultDate: null,
//         status: "in-progress",
//         results: null,
//     },
//     {
//         id: "4",
//         testName: "Urinalysis",
//         category: "Urinalysis",
//         orderedBy: "Dr. Sarah Johnson",
//         orderedDate: "2024-12-11",
//         resultDate: null,
//         status: "pending",
//         results: null,
//     },
// ];

const getStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="success" className="text-lg mr-3 text-green-600">
          Completed
        </Badge>
      );
    case "assigned":
      return (
        <Badge variant="warning" className="text-lg mr-3 text-[#5a78c9]">
          In Progress
        </Badge>
      );
    case "requested":
      return (
        <Badge variant="secondary" className="text-lg mr-3  text-yellow-500">
          Pending
        </Badge>
      );
    default:
      return null;
  }
};

const getResultBadge = (status) => {
  switch (status) {
    case "normal":
      return (
        <span className="text-xs px-2 py-0.5 rounded-full text-primary">
          Normal
        </span>
      );
    case "high":
      return (
        <span className="text-xs px-2 py-0.5 rounded-full text-red-600">
          High
        </span>
      );
    case "low":
      return (
        <span className="text-xs px-2 py-0.5 rounded-full text-warning">
          Low
        </span>
      );
    default:
      return null;
  }
};

export default function LabTest() {
  const [userRole] = useState("patient");
  const [activeItem, setActiveItem] = useState("/Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const { fetchPatientLabTests, patientLabTests, loading, error } =
    useContext(LabTestContext);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchPatientLabTests().finally(() => setInitialized(true));
  }, []);

  const completedTestsCount = patientLabTests?.filter(
    (test) => test.status === "completed",
  ).length;
  const inProgressTestsCount = patientLabTests?.filter(
    (test) => test.status === "assigned",
  ).length;
  const pendingTestsCount = patientLabTests?.filter(
    (test) => test.status === "requested",
  ).length;

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
      <div className="space-y-6">
        {/* Page Header */}
        <LabTestSummary
          completedTestsCount={completedTestsCount}
          inProgressTestsCount={inProgressTestsCount}
          pendingTestsCount={pendingTestsCount}
        />

        {/* Lab Tests List */}
        <div className="space-y-4">
          {patientLabTests.map((test) => (
            <LabTestDetails
              test={test}
              getStatusBadge={getStatusBadge}
              getResultBadge={getResultBadge}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
