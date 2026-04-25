import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Box, CalendarClock } from "lucide-react";
import {
  CircularProgress,
  Button,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import dayjs from "dayjs";
import MainLayout from "../Components/MainLayout.jsx";
import { DoctorsContext } from "../Context/DoctorsContext.jsx";
import { AppointmentsContext } from "../Context/AppointmentsContext.jsx";
import ScheduleCalender from "../Components/Patient's Components/ScheduleCalender.jsx";
import { DoctorInfo } from "../Components/Patient's Components/DoctorInfo.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor, loading, fetchDoctor } = useContext(DoctorsContext);
  const { createAppointment } = useContext(AppointmentsContext);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activeItem, setActiveItem] = useState("/Services");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDoctor(id);
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

  const WEEKDAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const scheduleMap = new Map(
    (doctor?.schedule || []).map((s) => [s.weekday, s]),
  );

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

  if (!doctor) {
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
          <p className="text-muted-foreground">Doctor not found</p>
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
      userName={doctor.name}
      activeItem={activeItem}
      onItemClick={handleItemClick}
      expanded={sidebarOpen}
    >
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/Services")}
          className="gap-2 text-muted-foreground hover:text-foreground "
          style={{ fontFamily: "Alan Sans, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctors
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <DoctorInfo doctor={doctor} />
          <ScheduleCalender
            doctor={doctor}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            createAppointment={createAppointment}
          />
        </div>

        {/* Working Hours - full width below the grid */}
        <Card className="card-shadow mt-6" style={{ borderRadius: 30 }}>
          <CardHeader
            title={
              <div className="flex items-center gap-2 py-3 px-2">
                <CalendarClock className="w-8 h-8 text-[#5A78C9]" />
                <div className="text-2xl font-bold">Working Hours</div>
              </div>
            }
          />
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {WEEKDAYS.map((day) => {
                const schedule = scheduleMap.get(day);
                return (
                  <div
                    key={day}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                  >
                    <span className="font-medium text-gray-900">{day}</span>
                    {schedule ? (
                      <span className="text-gray-600 text-sm">
                        {schedule.start_hour} - {schedule.end_hour}
                      </span>
                    ) : (
                      <span className="text-red-500 text-sm">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
