import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./LabTestsRequests.module.css";
import LabTestCard from "./LabTestCard";
import { ChevronLeft, ChevronRight, FlaskConical, Frown } from "lucide-react";
import { toast } from "sonner";
import { LabContext } from "../../Context/LabProvider";
import CircularProgress from "@mui/material/CircularProgress";
const ITEMS_PER_PAGE = 2;
const mockLabRequests = [
  {
    id: "1",
    testName: "Complete Blood Count (CBC)",
    patientName: "John Doe",
    doctorName: "Dr. Michael Chen",
    date: "2025-01-10",
    status: "assigned",
    result: null, // string OR url
  },
  {
    id: "2",
    testName: "Lipid Profile",
    doctorName: "Dr. Emily Watson",
    patientName: "Sarah Ali",
    date: "2025-01-12",
    status: "completed",
    result: "Cholesterol levels within normal range.",
  },
  {
    id: "3",
    testName: "X-Ray Chest",
    doctorName: "Dr. James Brown",
    patientName: "Emma Wilson",
    date: "2025-01-08",
    status: "completed",
    result: "https://via.placeholder.com/300", // image preview
  },
  {
    id: "4",
    testName: "Thyroid Function Test",
    doctorName: "Dr. Sarah Ali",
    patientName: "Michael Johnson",
    date: "2025-01-11",
    status: "cancelled",
    result: null,
  },
];

function LabTestsRequests() {
  const { searchValue = "" } = useOutletContext() || {};
  const [tests, setTests] = useState(mockLabRequests);
  const [activeFilter, setActiveFilter] = useState("assigned");
  const [page, setPage] = useState(1);
  const {
    getLabTechLabRequests,
    totalPages,
    labtests,
    loading,
    updateLabTestStatus,
    uploadLabTestResult,
  } = useContext(LabContext);
  useEffect(() => {
    getLabTechLabRequests(page, ITEMS_PER_PAGE, activeFilter);
  }, [page, activeFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateLabTestStatus(orderId, newStatus);
      // refresh current page after successful update
      await getLabTechLabRequests(page, ITEMS_PER_PAGE, activeFilter);
      toast.success("Lab test status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lab test status");
    }
  };

  const markCompleted = (id) => {
    handleStatusChange(id, "completed");
    toast.success("Test marked as completed");
  };

  const cancelTest = (id) => {
    handleStatusChange(id, "cancelled");
    toast.error("Test cancelled");
  };

  const uploadResult = async (id, result) => {
    try {
      if (!result) return;
      await uploadLabTestResult(id, result); // Upload first
      await getLabTechLabRequests(page, ITEMS_PER_PAGE, activeFilter); // Then refresh
      toast.success("Result uploaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload result");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Lab Test Requests</h1>

      {/* FILTERS */}
      <div className={styles.filters}>
        {["all", "assigned", "completed", "cancelled"].map((f) => (
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
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
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
          {/* GRID */}
          <div className={styles.grid}>
            {labtests?.map((test) => (
              <LabTestCard
                key={test.labtest_id}
                data={test}
                onComplete={markCompleted}
                onCancel={cancelTest}
                onUploadResult={uploadResult}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {labtests?.length > 0 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft size={18} /> Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}

          {labtests?.length === 0 && (
            <div className={styles.noResultsContainer}>
              <div className={styles.noResults}>No lab test requests found</div>
              <Frown size={20} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LabTestsRequests;
