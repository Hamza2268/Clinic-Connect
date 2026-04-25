import MainLayout from "../Components/MainLayout";
import { Badge, Box, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrescriptionSummary from "../Components/Patient's Components/PrescriptionSummary";
import PrescriptionInfo from "../Components/Patient's Components/PrescriptionInfo";
import { PrescriptionContext } from "../Context/PrescriptionContext";
import { CalendarDays, Clock } from "lucide-react";
import { AuthContext } from "../Context/AuthProviderContext";

const getStatusBadge = (SDate, EDate, expiredPrescriptionsCount) => {
  let status = "active";
  if (EDate) {
    const endDate = EDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ExpireDate = new Date(new Date(endDate.replace(" ", "T")));
    ExpireDate.setHours(0, 0, 0, 0);

    if (today.getTime() > ExpireDate.getTime())
      status = expiredPrescriptionsCount;
  }
  switch (status) {
    case "active":
      return <Badge variant="success">Active</Badge>;
    case "expired":
      return <Badge variant="destructive">Expired</Badge>;
  }
};
const mockUsers = {
  patient: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    role: "Patient",
    memberSince: "January 2024",
  },
  doctor: {
    name: "Dr. Michael Chen",
    email: "m.chen@clinic.com",
    phone: "+1 (555) 987-6543",
    location: "Los Angeles, CA",
    role: "Doctor",
    memberSince: "March 2023",
  },
  pharmacist: {
    name: "Emily Rodriguez",
    email: "e.rodriguez@pharmacy.com",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    role: "Pharmacist",
    memberSince: "June 2023",
  },
  lab_technician: {
    name: "James Wilson",
    email: "j.wilson@lab.com",
    phone: "+1 (555) 321-0987",
    location: "Houston, TX",
    role: "Lab Technician",
    memberSince: "September 2023",
  },
};

export default function Prescriptions() {
  const [userRole] = useState("patient");
  const [activeItem, setActiveItem] = useState("/Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userData = mockUsers[userRole];
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
  const { fetchPatientPrescriptions, prescriptions, loading, error } =
    useContext(PrescriptionContext);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchPatientPrescriptions().finally(() => setInitialized(true));
  }, []);
  const totalMedications = prescriptions.reduce(
    (acc, p) => acc + p.medications.length,
    0,
  );

  const totalPrescriptionsCount = prescriptions.length;
  const expiredPrescriptionsCount = prescriptions.filter(
    (p) => p?.status === "expired",
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              My Prescriptions
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your medications and request refills
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-18 mt-6">
          <div className="flex items-center gap-3 bg-white pl-[20px] pr-[150px] py-2 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CalendarDays className="w-6 h-6 text-[#5A78C9]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground mb-0">
                {totalPrescriptionsCount}
              </div>
              <p className="text-sm text-muted-foreground">
                Total Prescriptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white pl-[20px] pr-[150px] py-2 rounded-lg">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-0">
                {expiredPrescriptionsCount}
              </p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <PrescriptionInfo
              key={prescription.id}
              prescription={prescription}
              getStatusBadge={() => {
                getStatusBadge(
                  prescription.date,
                  prescription.expired_date,
                  expiredPrescriptionsCount,
                );
              }}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
