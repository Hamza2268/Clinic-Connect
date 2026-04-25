import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";
import { toast } from "sonner";

export const PrescriptionContext = createContext();

export function PrescriptionsProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const fetchPatientPrescriptions = async (
    page = 1,
    limit = 10,
    status = null,
    search = ""
  ) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }

    console.log("Fetching Prexcriptions:", { page, limit, status, search });
    setLoading(true);
    setError(null);
    const st = !status || status == "all" ? "" : status;

    try {
      const response = await axios.get(
        `/api/v1/prescriptions/patient?page=${Number(page)}&limit=${Number(
          limit
        )}&status=${st}&search=`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Prescriptions:", response.data.data);
      console.log(user);

      setPrescriptions(response.data.data || []);
    } catch (err) {
      console.error(
        "Error fetching Prescriptions:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to fetch Prescriptions");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPrescription = async (prescriptionData, patient_id) => {
    if (!token || user?.role !== "doctor") return;

    try {
      const response = await axios.post(
        `/api/v1/prescriptions/?${Number(patient_id)}`,
        prescriptionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("prescription created:", response.data);
    } catch (err) {
      console.error(
        " Error creating prescribtion ",
        err.response?.data || err.message
      );
    }
  };

  const getMedications = async (searchValue) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `/api/v1/medications/medication/?search=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setMedications(response.data.data);
      return response.data.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "failed to get medications"
      );
    } finally {
      setLoading(false);
    }
  };

  const addPrescription = async (prescriptionData, patient_id) => {
    if (!token) throw new Error("No auth token");
    console.log("provider addPrescription:", { patient_id, prescriptionData });
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/v1/prescriptions/${patient_id}`,
        prescriptionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "failed to add prescription"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPatientPrescriptions = async (patientID) => {
    if (!token || user?.role !== "doctor") return;
    if (!patientID) {
      console.error("Cannot fetch prescriptions: No patient ID provided.");
      return;
    }
    console.log("Fetching prescriptions:");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/v1/users/patients/${patientID}/prescriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      console.log(data);
      console.log("Prescriptions:", response.data);
      setPrescriptions(data || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch Prescriptions"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrescriptionContext.Provider
      value={{
        fetchPatientPrescriptions,
        prescriptions,
        loading,
        error,
        createPrescription,
        addPrescription,
        getMedications,
        medications,
        getPatientPrescriptions,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
}
