import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";

// weekday name -> index mapping
const WEEKDAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DoctorsContext = createContext();

export function DoctorsProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [shiftSchedule, setShiftSchedule] = useState(null);
  const fetchDoctor = async (nationalId) => {
    if (!token || !user) {
      console.log("❌ No token or user");
      return;
    }
    if (!nationalId) {
      console.log("❌ No nationalId provided");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/v1/users/doctors/${nationalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Response:", response.data);
      console.log("👨‍⚕️ Doctor:", response.data.data);
      setDoctor(response.data.data);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load doctor");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async (page = 1, limit = 10) => {
    if (!token || !user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/v1/users/getAllDoctors", {
        params: {
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const createMedicalRecord = async (recordData, patientId) => {
    if (!token || user?.role !== "doctor") return;

    try {
      const response = await axios.post(
        `/api/v1/medical_records/${patientId}`,
        recordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Medical record created:", response.data);
    } catch (err) {
      console.error(
        " Error creating medical record:",
        err.response?.data || err.message
      );
    }
  };

  const getShiftSchedule = async () => {
    if (!token || !user) return;
    try {
      const response = await axios.get(`/api/v1/shift-schedule/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Normalize response: API returns { data: { days: [...] } } or an array
      const payload = response.data && response.data.data;
      const daysArrRaw = Array.isArray(payload)
        ? payload
        : payload && Array.isArray(payload.days)
        ? payload.days
        : [];

      // Normalize each entry to a consistent shape: { weekday: number(0-6), start_hour, end_hour }
      const daysArr = daysArrRaw.map((e) => {
        let weekday = e.weekday;

        // if weekday is a name like "Monday", convert to index
        if (typeof weekday === "string" && isNaN(Number(weekday))) {
          const idx = WEEKDAY_NAMES.findIndex(
            (n) => n.toLowerCase() === String(weekday).toLowerCase()
          );
          weekday = idx >= 0 ? idx : weekday;
        } else if (typeof weekday === "string") {
          // numeric string -> number
          const num = Number(weekday);
          weekday = isNaN(num) ? weekday : num;
        }

        // Build normalized object and then spread the original to avoid overwriting
        return {
          ...e,
          weekday: typeof weekday === "number" ? weekday : Number(weekday),
          start_hour:
            e.start_hour ?? e.startHour ?? e.start ?? e.shiftStart ?? null,
          end_hour: e.end_hour ?? e.endHour ?? e.end ?? e.shiftEnd ?? null,
        };
      });

      setShiftSchedule(daysArr);
      console.log("Shift schedule fetched (normalized):", daysArr);
      return daysArr;
    } catch (err) {
      console.error(
        " Error fetching shift schedule:",
        err.response?.data || err.message
      );
    }
  };

  const updateShiftSchedule = async (weekday, start_hour, end_hour) => {
    if (!token || !user) return;

    try {
      // weekday should be the weekday name (e.g., "Monday").
      const response = await axios.patch(
        `/api/v1/shift-schedule/${encodeURIComponent(weekday)}`,
        { start_hour, end_hour },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // refresh the schedule to ensure consistent shape
      const refreshed = await getShiftSchedule();
      if (refreshed) setShiftSchedule(refreshed);
      console.log("Shift schedule updated:", response.data);
    } catch (err) {
      console.error(
        " Error updating shift schedule:",
        err.response?.data || err.message
      );
    }
  };

  const addShiftScheduleData = async (start_hour, end_hour, weekday) => {
    if (!token || !user) return;

    try {
      const response = await axios.post(
        `/api/v1/shift-schedule/`,
        { start_hour, end_hour, weekday },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // refresh the schedule to ensure consistent shape
      const refreshed = await getShiftSchedule();
      if (refreshed) setShiftSchedule(refreshed);
      console.log("Shift schedule created:", response.data);
    } catch (err) {
      console.error(
        " Error updating shift schedule:",
        err.response?.data || err.message
      );
    }
  };

  const deleteShiftSchedule = async (weekday) => {
    if (!token || !user) return;

    try {
      const response = await axios.delete(
        `/api/v1/shift-schedule/${encodeURIComponent(weekday)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      // refresh to fetch current days array
      const refreshed = await getShiftSchedule();
      if (refreshed) setShiftSchedule(refreshed);
      return response.data;
    } catch (err) {
      console.error(
        " Error deleting shift schedule:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        doctor,
        loading,
        error,
        fetchDoctors,
        fetchDoctor,
        createMedicalRecord,
        getShiftSchedule,
        updateShiftSchedule,
        addShiftScheduleData,
        deleteShiftSchedule,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
}
