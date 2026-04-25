// ServicesContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";

export const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [labs, setLabs] = useState([]);

  const fetchDoctor = async (nationalId) => {
    console.log("Attempting fetchDoctor...", {
      nationalId,
      hasToken: !!token,
      hasUser: !!user,
    });
    if (!token || !user || !nationalId) {
      console.warn("❌ fetchDoctor aborted: Missing data");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/v1/users/doctors/${nationalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctor(response.data.data[0]);
      // console.log(response.data);
      console.log("✅ Data fetched:", response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctor");
      console.log("here");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async (page = 1, limit = 10) => {
    if (!token || !user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/v1/users/getAllDoctors", {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors(response.data.data || []);
      console.log(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchPharmacies = async (page = 1, limit = 10) => {
    if (!token || !user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/v1/users/getAllPharmacists", {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      setPharmacies(response.data.data || []);
      console.log(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pharmacies");
    } finally {
      setLoading(false);
    }
  };

  const fetchLabs = async (page = 1, limit = 10) => {
    if (!token || !user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/v1/users/getAllLabs", {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      setLabs(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load labs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServicesContext.Provider
      value={{
        // Doctors
        doctors,
        doctor,
        fetchDoctors,
        fetchDoctor,

        // Pharmacies
        pharmacies,
        fetchPharmacies,

        // Labs
        labs,
        fetchLabs,

        // Shared
        loading,
        error,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
