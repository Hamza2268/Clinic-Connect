import { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";

export const PharmacyContext = createContext();

export default function PharmacyProvider({ children }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pharmacist, setPharmacist] = useState(null);
  const [pharmacistError, setPharmacistError] = useState(null);

  const { token } = useContext(AuthContext);

  const getPharmacistProfile = useCallback(
    async (pharmacistId) => {
      if (!token || !pharmacistId) return;
      setLoading(true);
      setPharmacistError(null);
      try {
        const response = await axios.get(
          `/api/v1/users/pharmacists/${pharmacistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPharmacist(response.data.data);
      } catch (err) {
        console.error(err);
        setPharmacistError(
          err.response?.data?.message || "Failed to load pharmacist"
        );
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const getPrescriptionsForPatient = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/v1/prescriptions/patient", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getAvailableMedications = useCallback(
    async (pharmacistId) => {
      if (!token || !pharmacistId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/v1/available-medications/${pharmacistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMedications(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch medications");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createMedicineOrder = useCallback(
    async (pharmacistId, medicines) => {
      if (!token || !pharmacistId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `/api/v1/medicine-orders/${pharmacistId}`,
          { medicines },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to place order");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createMedicineOrderByPrescription = useCallback(
    async (pharmacistId, prescriptionId) => {
      if (!token || !pharmacistId || !prescriptionId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `/api/v1/medicine-orders/prescription/${pharmacistId}`,
          { prescription_id: prescriptionId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to place prescription order"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const value = {
    // State
    prescriptions,
    setPrescriptions,
    medications,
    setMedications,
    orders,
    setOrders,
    loading,
    setLoading,
    error,
    setError,
    pharmacist,
    setPharmacist,
    pharmacistError,
    setPharmacistError,
    // Functions
    getPharmacistProfile,
    getPrescriptionsForPatient,
    getAvailableMedications,
    createMedicineOrder,
    createMedicineOrderByPrescription,
  };

  return (
    <PharmacyContext.Provider value={value}>
      {children}
    </PharmacyContext.Provider>
  );
}
