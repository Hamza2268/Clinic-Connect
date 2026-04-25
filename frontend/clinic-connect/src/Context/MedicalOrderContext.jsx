import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";
import { toast } from "sonner";

export const MedicalOrderContext = createContext();

export function MedicalOrderProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientMedicalOrders, setPatientMedicalOrders] = useState([]);
  const [pharmacyOrders, setPharmacyOrders] = useState([]);
  const [pages, setPages] = useState(0);
  const [pharmacistInventory, setPharmacistInventory] = useState([]);
  const fetchPatientMedicalOrders = async (
    // targetPatientId = null,
    page = 1,
    limit = 20,
    status = null,
    search = ""
  ) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }

    console.log(user);

    console.log("Fetching Medical Orders:", { page, limit, status, search });
    setLoading(true);
    setError(null);
    const st = !status || status == "all" ? "" : status;

    try {
      const response = await axios.get(
        `/api/v1/medicine-orders/?page=${Number(page)}&limit=${Number(
          limit
        )}&status=${st}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      // console.log(data);
      console.log("Medical Orders:", data);

      setPatientMedicalOrders(data || []);
      console.log(patientMedicalOrders);
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

  const getPharmacyOrders = async (
    page = 1,
    limit = 10,
    status = null,
    search = ""
  ) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }

    const statusMap = {
      all: "",
      pending: "requested",
      approved: "ready_for_pickup",
      rejected: "cancelled",
      completed: "completed",
    };

    // Accept both human keys (pending/approved) and raw backend statuses
    let st;
    if (!status || status === "all") st = "";
    else if (statusMap[status] !== undefined) st = statusMap[status];
    else st = status; // assume it's already a backend status like 'requested'

    console.log("Fetching Pharmacy Orders:", { page, limit, status, search });
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/v1/medicine-orders/?page=${Number(page)}&limit=${Number(
          limit
        )}&status=${st}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;

      console.log("Pharmacy Orders:", response.data);
      setPages(response.data.totalPages);
      setPharmacyOrders(data || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch Pharmacy Orders"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const UpdateMedicalOrderStatus = async (orderId, newStatus) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/v1/medicine-orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Updated Medical Order:", response.data);

      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.response?.data?.message || "Failed to update Medical Order status"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPharmacistInventory = async (page, limit, sort, order) => {
    if (!token || !user) {
      console.log(" No token or user");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/v1/available-medications/?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Pharmacist Inventory:", response.data);
      setPharmacistInventory(response.data.data || []);
      setPages(response.data.totalPages);
      return response.data.data;
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.response?.data?.message || "Failed to fetch Pharmacist Inventory"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // now requires medication id and item data
  const addPharmacistInventoryItem = async (medicine_id, item) => {
    if (!token || !user) return null;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        medicine_id: Number(medicine_id),
        name: item.name,
        quantity: Number(item.quantity),
        price: String(item.price),
        side_effects: item.side_effects || item.sideEffects || "",
      };
      console.log(payload);
      const res = await axios.post(
        `/api/v1/available-medications/${payload.medicine_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // refresh inventory
      await getPharmacistInventory(1, 10, "name", "asc");
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to add inventory item"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePharmacistInventoryItem = async (medicine_id, data) => {
    if (!token || !user) return null;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: data.name,
        quantity: Number(data.quantity),
        price: String(data.price),
        side_effects: data.side_effects || data.sideEffects || "",
      };
      const res = await axios.patch(
        `/api/v1/available-medications/${medicine_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await getPharmacistInventory(1, 10, "name", "asc");
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update inventory item"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePharmacistInventoryItem = async (medicine_id) => {
    if (!token || !user) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(
        `/api/v1/available-medications/${medicine_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await getPharmacistInventory(1, 10, "name", "asc");
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to delete inventory item"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedicalOrderContext.Provider
      value={{
        patientMedicalOrders,
        fetchPatientMedicalOrders,
        loading,
        error,
        getPharmacyOrders,
        pharmacyOrders,
        pages,
        UpdateMedicalOrderStatus,
        getPharmacistInventory,
        pharmacistInventory,
        addPharmacistInventoryItem,
        updatePharmacistInventoryItem,
        deletePharmacistInventoryItem,
      }}
    >
      {children}
    </MedicalOrderContext.Provider>
  );
}
