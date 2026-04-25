import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Check, FlaskConical, FileText, Send, X } from "lucide-react";
import AsyncSelect from "react-select/async";
import styles from "./LabRequests.module.css";
import { toast, Toaster } from "sonner";
import { LabContext } from "../../Context/LabProvider";

// Fake lab tests database for demo
const fakeLabTestsDB = [
  { id: "cbc", name: "Complete Blood Count (CBC)" },
  { id: "lipid", name: "Lipid Profile" },
  { id: "glucose", name: "Fasting Blood Glucose" },
  { id: "glucose-random", name: "Random Blood Glucose" },
  { id: "glucose-pp", name: "Post Prandial Glucose" },
  { id: "hba1c", name: "HbA1c (Glycated Hemoglobin)" },
  { id: "thyroid", name: "Thyroid Function Test (TFT)" },
  { id: "tsh", name: "TSH (Thyroid Stimulating Hormone)" },
  { id: "t3", name: "T3 (Triiodothyronine)" },
  { id: "t4", name: "T4 (Thyroxine)" },
  { id: "liver", name: "Liver Function Test (LFT)" },
  { id: "kidney", name: "Kidney Function Test (KFT)" },
  { id: "urine", name: "Urinalysis" },
  { id: "vitamin-d", name: "Vitamin D Test" },
  { id: "vitamin-b12", name: "Vitamin B12 Test" },
  { id: "iron", name: "Iron Studies" },
  { id: "esr", name: "ESR (Erythrocyte Sedimentation Rate)" },
  { id: "crp", name: "CRP (C-Reactive Protein)" },
  { id: "electrolytes", name: "Electrolytes Panel" },
  { id: "calcium", name: "Calcium Level" },
];

// Fake patient data for demo
const tempPatients = [
  { id: 3, name: "John Doe", lastVisit: "2025-01-10", recordsCount: 5 },
  { id: 8, name: "Sarah Ali", lastVisit: "2025-02-04", recordsCount: 2 },
  { id: 2, name: "Ahmed Khan", lastVisit: "2025-02-04", recordsCount: 2 },
  { id: 9, name: "Maria Garcia", lastVisit: "2025-02-04", recordsCount: 2 },
  { id: 18, name: "James Wilson", lastVisit: "2025-02-04", recordsCount: 2 },
];

// Custom styles for react-select
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(99, 102, 241, 0.1)" : "none",
    borderRadius: "8px",
    padding: "6px",
    fontSize: "14px",
    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#6366f1"
      : state.isFocused
      ? "#eef2ff"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    cursor: "pointer",
    fontSize: "14px",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
};

function LabRequests() {
  const { id, name: patientname } = useParams();
  const [selectedTest, setSelectedTest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getLabExamination, createLabRequest } = useContext(LabContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   // preload list (optional)
  //   if (typeof GetAllLabTest === "function") GetAllLabTest();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const [searchTerm, setSearchTerm] = useState("");
  // const patient = tempPatients.find((p) => p.id === Number(id));

  // Load lab tests from backend with search (using fake data for now)

  // Create the loadOptions function for AsyncSelect — call backend search
  const loadLabTests = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
      const results = await getLabExamination(inputValue);
      const list = Array.isArray(results) ? results : [];
      return list.map((test) => ({
        value: test.test_id ?? test.id,
        label: test.test_name ?? test.name,
        raw: test,
      }));
    } catch (err) {
      console.error("Error loading lab tests:", err);
      return [];
    }
  };

  const handleSelectTest = (option) => {
    if (option) setSelectedTest(option);
  };

  const removeTest = () => {
    setSelectedTest(null);
  };

  const submitRequest = async () => {
    setIsSubmitting(true);
    try {
      const payload = { test_id: Number(selectedTest.value) };
      // ensure the request completes before proceeding
      await createLabRequest(payload, id);
      console.log(selectedTest);
      toast.success("Lab request created successfully!");
      navigate(-1);
      // NOTE: we intentionally do NOT clear `selectedTest` here so the
      // submit button stays enabled unless the user clears the selection.
    } catch (error) {
      console.log(error.message || "error failed to create lab request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      <h1 className={styles.pageTitle}>Issue Lab Request</h1>

      <div className={styles.content}>
        {/* TEST SELECTION */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            <FlaskConical size={28} className={styles.icon} />
            Select Lab Tests
          </h2>

          {/* Search and Add Tests */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
            >
              Search Lab Test
            </label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadLabTests}
              onChange={handleSelectTest}
              value={selectedTest}
              placeholder="Search for lab tests..."
              styles={selectStyles}
              noOptionsMessage={({ inputValue }) =>
                !inputValue || inputValue.length < 2
                  ? "Type at least 2 characters to search"
                  : `No tests found for "${inputValue}"`
              }
              loadingMessage={() => "Searching lab tests..."}
            />
          </div>

          {/* Selected Tests Display */}
          {selectedTest ? (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                Selected Test
              </label>
              <div className={styles.selectedTestsList}>
                <div className={styles.selectedTestItem}>
                  <Check size={16} className={styles.checkIcon} />
                  <span>{selectedTest.label}</span>
                  <button
                    className={styles.removeTestBtn}
                    onClick={removeTest}
                    aria-label="Remove test"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.noTests}>
              No test selected yet. Search and select a test above.
            </p>
          )}
        </div>

        {/* SUMMARY */}
        <div className={styles.summaryCard}>
          <h2 className={styles.sectionTitle}>
            <FileText size={28} className={styles.icon} />
            Summary
          </h2>

          <div className={styles.summaryRow}>
            <span>Patient</span>
            <strong>{patientname}</strong>
          </div>

          <div className={styles.summaryRow}>
            <span>Selected Test</span>
            <strong>{selectedTest ? selectedTest.label : "None"}</strong>
          </div>

          <button
            className={styles.submitBtn}
            onClick={submitRequest}
            disabled={isSubmitting || !selectedTest}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <div className={styles.submitContent}>
                <div>Save Record</div>
                <Send size={16} />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LabRequests;
