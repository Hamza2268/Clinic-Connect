import { Children, createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";
import { toast } from "sonner";

export const MedicalRecordContext = createContext();

export function MedicalRecordProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientMedicalRecords, setPatientMedicalRecords] = useState([]);
  //   const [totalpages, setTotalpages] = useState(0);
  // Patient and Doctor
  const fetchPatientMedicalRecords = async (
    targetPatientId = null,
    page = 1,
    limit = 20,
    status = null,
    search = ""
  ) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }

    const idToFetch = targetPatientId || user.national_id;

    if (!idToFetch) {
      console.error("Cannot fetch records: No patient ID provided.");
      return;
    }

    console.log("Fetching Lab Tests:", { page, limit, status, search });
    setLoading(true);
    setError(null);
    const st = !status || status == "all" ? "" : status;

    try {
      const response = await axios.get(
        `/api/v1/medical_records/${idToFetch}?page=${Number(
          page
        )}&limit=${Number(limit)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      console.log(data);
      console.log("Medical Records:", response.data);
      // console.log(user);

      setPatientMedicalRecords(data || []);
      //   setTotalpages(response.data.totalPages || 0);
      console.log(patientMedicalRecords);
    } catch (err) {
      console.error(
        "Error fetching Medical Records:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Failed to fetch Medical Records"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMedicalRecordForDoctor = async (patientID) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }

    if (!patientID) {
      console.error("Cannot fetch records: No patient ID provided.");
      return;
    }

    console.log("Fetching medical records:");
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/v1/users/patients/${patientID}/medical-records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      console.log(data);
      console.log("Medical Records:", response.data);
      setPatientMedicalRecords(data || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch Medical Records"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedicalRecordContext.Provider
      value={{
        patientMedicalRecords,
        fetchPatientMedicalRecords,
        loading,
        error,
        getMedicalRecordForDoctor,
      }}
    >
      {children}
    </MedicalRecordContext.Provider>
  );
}
