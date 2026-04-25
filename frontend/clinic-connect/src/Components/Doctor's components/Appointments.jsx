import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./Appointments.module.css";
import WeeklyCalendar from "./WeeklyCalendar";
import { Check, X, ChevronLeft, ChevronRight, Frown } from "lucide-react";
import ListIcon from "@mui/icons-material/List";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AppointmentsContext } from "../../Context/AppointmentsContext";
import CircularProgress from "@mui/material/CircularProgress";
function Appointments() {
  const { searchValue = "" } = useOutletContext() || {};
  const navigate = useNavigate();
  const {
    fetchDoctorAppointments,
    loading,
    appointments,
    updateAppointmentStatus,
    pages,
  } = useContext(AppointmentsContext);
  const [activeFilter, setActiveFilter] = useState("all");
  const [view, setView] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Adjust this number as needed

  useEffect(() => {
    fetchDoctorAppointments(
      currentPage,
      itemsPerPage,
      activeFilter,
      searchValue
    );
  }, [searchValue, activeFilter, currentPage]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchValue]);

  const updateStatus = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    // setAppointments((prev) =>
    //   prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    // );
  };

  const transformedAppointments = appointments.map((appt) => ({
    id: appt.appointment_id,
    date: appt.date.split("T")[0], // Convert '2025-12-29T22:00:00.000Z' to '2025-12-29'
    startHour: appt.start_hour.substring(0, 5), // Convert '13:00:00' to '13:00'
    endHour: appt.end_hour.substring(0, 5), // Convert '14:00:00' to '14:00'
    patientName: appt.patient_name || "Unknown Patient", // Add patient name
    status: appt.status || "scheduled", // Add status
    type: appt.type || "Consultation", // Add type
  }));

  // Pagination calculations
  const totalPages = pages;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusClass = (status) => {
    switch (status) {
      case "upcoming":
        return styles.scheduled;
      case "in-progress":
        return styles.inprogress;
      case "missed":
        return styles.missed;
      case "completed":
        return styles.completed;
      case "cancelled":
        return styles.cancelled;
      default:
        return "";
    }
  };

  const getInitials = (name) => {
    const parts = name?.split(" ");
    return "kk";
    // if (!parts) return "";
    // return parts[0][0] + parts[1][0];
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Appointments</h1>

      <div className={styles.topBar}>
        {/* FILTER BUTTONS */}
        <div className={styles.filters}>
          {[
            "all",
            "upcoming",
            "in-progress",
            "missed",
            "completed",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              className={`${styles.filterBtn} ${
                activeFilter === status ? styles.activeFilter : ""
              }`}
              onClick={() => setActiveFilter(status)}
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {/* View Toggle */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${
              view === "list" ? styles.activeView : ""
            }`}
            onClick={() => setView("list")}
          >
            <ListIcon className={styles.icon} />
            <span>List View</span>
          </button>

          <button
            className={`${styles.viewBtn} ${
              view === "week" ? styles.activeView : ""
            }`}
            onClick={() => setView("week")}
          >
            <CalendarMonthIcon className={styles.icon} />
            <span>Weekly Calendar</span>
          </button>
        </div>
      </div>
      {loading && (
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
      )}
      {!loading && (
        <>
          {/* WEEK VIEW */}
          {view === "week" && (
            <WeeklyCalendar appointments={transformedAppointments} />
          )}

          {/* LIST VIEW */}
          {view === "list" && (
            <>
              {appointments?.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>No appointments found</p>
                  <Frown />
                </div>
              ) : (
                <>
                  <div className={styles.list}>
                    {appointments?.map((appt) => (
                      <div key={appt.appointment_id} className={styles.card}>
                        {/* Top Row */}
                        <div className={styles.topRow}>
                          <div className={styles.patientInfo}>
                            <div className={styles.avatar}>
                              {getInitials(appt.patient_name)}
                            </div>

                            <div>
                              <h3 className={styles.patientName}>
                                {appt.patient_name}
                              </h3>
                              <p className={styles.dateText}>
                                {appt.date.split("T")[0]} at {appt.start_hour}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`${styles.status} ${statusClass(
                              appt.status
                            )}`}
                          >
                            {appt.status.replace(/^\w/, (c) => c.toUpperCase())}
                          </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.symptomsSection}>
                          <div>
                            <p className={styles.symptomsLabel}>
                              Symptoms/Notes
                            </p>
                            <p className={styles.symptomsText}>
                              {appt.symptoms}
                            </p>
                          </div>
                          <div className={styles.actions}>
                            {appt.status === "upcoming" && (
                              <button
                                className={styles.cancelBtn}
                                onClick={() =>
                                  updateStatus(appt.appointment_id, "cancelled")
                                }
                              >
                                <X size={16} /> Cancel Appointment
                              </button>
                            )}

                            {appt.status === "in-progress" && (
                              <>
                                <button
                                  className={styles.missedBtn}
                                  onClick={() =>
                                    updateStatus(appt.appointment_id, "missed")
                                  }
                                >
                                  <X size={16} /> Mark Missed
                                </button>

                                <button
                                  className={styles.completeBtn}
                                  onClick={() =>
                                    updateStatus(
                                      appt.appointment_id,
                                      "completed"
                                    )
                                  }
                                >
                                  <Check size={16} /> Mark Completed
                                </button>
                              </>
                            )}

                            {appt.status === "completed" && (
                              <>
                                <button
                                  className={styles.AddprescriptionBtn}
                                  onClick={() =>
                                    navigate(
                                      `/Doctor/prescribe/${appt.patient_id}/${appt.patient_name}`
                                    )
                                  }
                                >
                                  + Add Prescription
                                </button>
                                <button
                                  className={styles.AddprescriptionBtn}
                                  onClick={() =>
                                    navigate(
                                      `/Doctor/MedicalRecord/${appt.patient_id}/${appt.patient_name}`
                                    )
                                  }
                                >
                                  + Add Medical Record
                                </button>
                                <button
                                  className={styles.AddprescriptionBtn}
                                  onClick={() =>
                                    navigate(
                                      `/Doctor/labRequests/${appt.patient_id} /${appt.patient_name}`
                                    )
                                  }
                                >
                                  + Request lab test
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageBtn}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={20} />
                        Previous
                      </button>

                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className={styles.pageBtn}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Appointments;
