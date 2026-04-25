import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";
import { toast } from "sonner";

export const PatientsContext = createContext();

export function PatientsProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [totalPages, setTotalPages] = useState(0);
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const fetchPatients = async (page, limit, search) => {
    if (!token || user?.role !== "doctor") return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/v1/users/patients/?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setPatients(response.data.data);
      setTotalPatients(response.data.results);

      return {
        patients: response.data.data,
        totalcount: response.data.results,
      };
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = async (patientId) => {
    if (!token || user?.role !== "doctor") return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/v1/users/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setPatientInfo(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load patient");
    } finally {
      setLoading(false);
    }
  };

  const fetchPharmacistPatients = async (page, limit, search) => {
    if (!token || user?.role !== "pharmacist") return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/v1/users/pharmacist/patients/?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setPatients(response.data.data);
      setTotalPatients(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load patient");
    } finally {
      setLoading(false);
    }
  };

  const getPharmacistPatientInfo = async (patientId) => {
    if (!token || user?.role !== "pharmacist") return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/v1/users/pharmacist/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setPatientInfo(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientsContext.Provider
      value={{
        patients,
        totalPatients,
        loading,
        error,
        fetchPatients,
        getPatientById,
        patientInfo,
        fetchPharmacistPatients,
        getPharmacistPatientInfo,
        totalPages,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
}
