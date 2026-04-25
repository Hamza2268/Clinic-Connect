import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";

export const AppointmentsContext = createContext();

export function AppointmentsProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [pages, setPages] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);

  // Fetch Appointments
  const fetchDoctorAppointments = async (
    page = 1,
    limit = 5,
    status,
    searchValue,
  ) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    const st = status == "all" ? "" : status;
    try {
      const response = await axios.get(
        `/api/v1/appointments/get_appointments/?page=${Number(
          page,
        )}&limit=${Number(limit)}&status=${st}&search=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      setAppointments(response.data.data);
      setPages(response.data.totalPages);
      return { appoint: response.data.data };
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // When auth `token` becomes available (e.g. after reload), automatically fetch
  // initial appointments so components that mounted earlier still receive data.
  // useEffect(() => {
  //   if (!token) return;
  //   // load first page with default filters
  //   fetchDoctorAppointments(1, 5, "all", "");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [token]);

  // Create Appointment (Patient)
  const createAppointment = async (appointmentData, national_id) => {
    if (!token || user?.role !== "patient") return;

    setLoading(true);
    setError(null);
    console.log(appointmentData, national_id);
    try {
      await axios.post(`/api/v1/appointments/${national_id}`, appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // await fetchAppointments(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update Appointment Status (Doctor)
  const updateAppointmentStatus = async (appointmentId, action) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    // console.log(token);
    try {
      await axios.patch(
        `/api/v1/appointments/${appointmentId}/status`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(user.role);
      setAppointments((prev) =>
        prev?.map((appt) =>
          appt._id === appointmentId ? { ...appt, status } : appt,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientAppointments = async (
    page = 1,
    limit = 100,
    status = null,
    search = "",
  ) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }

    console.log("🔍 Fetching appointments:", { page, limit, status, search });
    setLoading(true);
    setError(null);
    const st = !status || status == "all" ? "" : status;

    try {
      const response = await axios.get(
        `/api/v1/appointments/get_appointments?page=${Number(
          page,
        )}&limit=${Number(limit)}&status=${st}&search=${st}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPatientAppointments(response.data || []);

      // return response.data.data;
    } catch (err) {
      console.error(
        "Error fetching appointments:",
        err.response?.data || err.message,
      );
      setError(err.response?.data?.message || "Failed to fetch appointments");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        error,
        fetchDoctorAppointments,
        createAppointment,
        updateAppointmentStatus,
        pages,
        patientAppointments,
        fetchPatientAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}
