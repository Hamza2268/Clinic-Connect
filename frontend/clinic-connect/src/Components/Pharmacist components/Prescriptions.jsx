import { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./Prescriptions.module.css";
import PrescriptionCard from "./PrescriptionCard";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MedicalOrderContext } from "../../Context/MedicalOrderContext";
import CircularProgress from "@mui/material/CircularProgress";
const Prescriptions = () => {
  const { searchValue = "" } = useOutletContext() || {};
  const [activeFilter, setActiveFilter] = useState("requested");
  const {
    getPharmacyOrders,
    pharmacyOrders,
    pages: totalPagesss,
    UpdateMedicalOrderStatus,
    loading,
  } = useContext(MedicalOrderContext);
  // Pagination
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(1);

  // PAGINATION CALCULATIONS
  const totalPages = totalPagesss;

  const handleApprove = (id) => {
    // change to ready_for_pickup on backend
    return handleStatusChange(id, "ready_for_pickup");
  };

  const handleDispense = (id) => {
    // change to completed on backend
    return handleStatusChange(id, "completed");
  };

  const handleReject = (id) => {
    // change to cancelled on backend
    return handleStatusChange(id, "cancelled");
  };

  const [processingOrderId, setProcessingOrderId] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setProcessingOrderId(orderId);
      const res = await UpdateMedicalOrderStatus(orderId, newStatus);
      if (res) {
        // refresh current page
        getPharmacyOrders(page, ITEMS_PER_PAGE, activeFilter, searchValue);
        toast.success("Order status updated");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    } finally {
      setProcessingOrderId(null);
    }
  };

  useEffect(() => {
    getPharmacyOrders(page, ITEMS_PER_PAGE, activeFilter, searchValue);
  }, [activeFilter, page]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Medical Orders </h1>

      {/* Filters */}
      <div className={styles.filters}>
        {["all", "requested", "ready_for_pickup", "cancelled", "completed"].map(
          (f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setPage(1);
              }}
              className={`${styles.filterBtn} ${
                activeFilter === f ? styles.active : ""
              }`}
            >
              {f === "all"
                ? "All"
                : f === "ready_for_pickup"
                ? "Ready for pickup"
                : f === "completed"
                ? "Received"
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          )
        )}
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
          {/* Grid */}
          <div className={styles.grid}>
            {pharmacyOrders?.map((prescription) => (
              <PrescriptionCard
                key={prescription.order_id}
                data={prescription}
                onApprove={handleApprove}
                onDispense={handleDispense}
                onReject={handleReject}
                processingOrderId={processingOrderId}
              />
            ))}
          </div>

          {/* Pagination */}
          {pharmacyOrders?.length > 0 && (
            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={20} />
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {pharmacyOrders?.length === 0 && (
            <p className={styles.noResults}>No prescriptions found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Prescriptions;
