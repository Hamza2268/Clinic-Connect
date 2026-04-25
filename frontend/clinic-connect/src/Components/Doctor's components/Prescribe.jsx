import { useState, useContext } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Check,
  Pill,
  FileCheck,
  User,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import AsyncSelect from "react-select/async";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Prescribe.module.css";
import { PrescriptionContext } from "../../Context/PrescriptionContext";

// Fake medication data for demo
const fakeMedicationsDB = [
  { id: 1, name: "Amoxicillin 500mg" },
  { id: 2, name: "Amoxicillin 250mg" },
  { id: 3, name: "Amoxicillin 875mg" },
  { id: 4, name: "Ibuprofen 400mg" },
  { id: 5, name: "Ibuprofen 600mg" },
  { id: 6, name: "Paracetamol 500mg" },
  { id: 7, name: "Paracetamol 1000mg" },
  { id: 8, name: "Omeprazole 20mg" },
  { id: 9, name: "Omeprazole 40mg" },
  { id: 10, name: "Metformin 500mg" },
  { id: 11, name: "Metformin 850mg" },
  { id: 12, name: "Lisinopril 10mg" },
  { id: 13, name: "Lisinopril 20mg" },
  { id: 14, name: "Atorvastatin 20mg" },
  { id: 15, name: "Atorvastatin 40mg" },
  { id: 16, name: "Amlodipine 5mg" },
  { id: 17, name: "Amlodipine 10mg" },
  { id: 18, name: "Aspirin 75mg" },
  { id: 19, name: "Aspirin 100mg" },
  { id: 20, name: "Ciprofloxacin 500mg" },
];

// Fake patient data for demo
const fakePatientsDB = [
  { id: "1", name: "John Doe", age: 45, gender: "Male" },
  { id: "2", name: "Sarah Ali", age: 32, gender: "Female" },
  { id: "3", name: "Ahmed Khan", age: 58, gender: "Male" },
  { id: "4", name: "Maria Garcia", age: 28, gender: "Female" },
  { id: "5", name: "James Wilson", age: 67, gender: "Male" },
];

// Custom styles for react-select to match your design
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(99, 102, 241, 0.1)" : "none",
    borderRadius: "8px",
    padding: "2px",
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

export default function Prescribe() {
  const [medicationList, setMedicationList] = useState([
    { id: 1, name: "", medicine_id: null, dose: "", note: "" },
  ]);
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  // Get patient ID from route params
  const { id, name: patientname } = useParams();

  // Find patient from fake data (replace with API call later)
  // const patient = fakePatientsDB.find((p) => p.id === id) || null;

  // Load medications using PrescriptionContext.getMedications
  const { getMedications, addPrescription } = useContext(PrescriptionContext);

  const loadMedications = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
      const results = await getMedications(inputValue);
      if (!Array.isArray(results)) return [];
      return results.map((med) => ({
        value: med.id ?? med.medication_id ?? med.med_id,
        label:
          med.name ??
          med.med_name ??
          med.medication_name ??
          med.title ??
          String(med.value ?? ""),
      }));
    } catch (err) {
      console.error("Error loading medications:", err);
      return [];
    }

    /* 
    // Real API implementation - uncomment when backend is ready:
    try {
      const response = await fetch(
        `/api/medications?search=${encodeURIComponent(inputValue)}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch medications");
      }

      const data = await response.json();
      
      return data.map((med) => ({
        value: med.id,
        label: med.name,
        // Add extra data if needed:
        // strength: med.strength,
        // warnings: med.warnings,
      }));
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast.error("Failed to load medications");
      return [];
    }
    */
  };

  const addMedication = () => {
    setMedicationList([
      ...medicationList,
      { id: Date.now(), name: "", medicine_id: null, dose: "", note: "" },
    ]);
  };

  const removeMedication = (id) => {
    if (medicationList.length > 1) {
      setMedicationList(medicationList.filter((med) => med.id !== id));
    }
  };

  const updateMedication = (id, field, value) => {
    setMedicationList(
      medicationList.map((med) =>
        med.id === id ? { ...med, [field]: value } : med,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!patientname || !id) {
      toast.error("No patient selected (invalid or missing patient ID)");
      return;
    }

    console.log("Submitting medicationList:", medicationList);

    // Try to auto-resolve typed medication names to IDs using getMedications
    const resolvedList = await Promise.all(
      medicationList.map(async (med) => {
        if (
          (med.medicine_id === null || med.medicine_id === undefined) &&
          med.name &&
          String(med.name).trim().length >= 2
        ) {
          try {
            const results = await getMedications(String(med.name).trim());
            if (Array.isArray(results) && results.length > 0) {
              // find exact label match or fallback to first result
              const match = results.find(
                (r) =>
                  (r.name && r.name.toLowerCase() === med.name.toLowerCase()) ||
                  (r.med_name &&
                    r.med_name.toLowerCase() === med.name.toLowerCase()),
              );
              const pick = match || results[0];
              return {
                ...med,
                medicine_id:
                  pick.id ?? pick.medication_id ?? pick.med_id ?? pick.value,
              };
            }
          } catch (e) {
            console.warn(
              "Failed to resolve medication name:",
              med.name,
              e.message,
            );
          }
        }
        return med;
      }),
    );

    // Update state with any resolved ids
    setMedicationList(resolvedList);

    const validMedications = resolvedList.filter((med) => {
      const hasMedicineId =
        med.medicine_id !== null &&
        med.medicine_id !== undefined &&
        String(med.medicine_id).trim() !== "";
      const hasDose =
        med.dose !== null &&
        med.dose !== undefined &&
        String(med.dose).trim() !== "";
      return hasMedicineId && hasDose;
    });

    if (validMedications.length === 0) {
      console.log("valid", validMedications);

      toast.error("Please add at least one medication");
      return;
    }
    // Prevent selecting the same medication twice
    const keys = validMedications.map((m) =>
      String(m.medicine_id ?? m.name ?? "")
        .trim()
        .toLowerCase(),
    );
    const duplicate = keys.find((k, i) => k && keys.indexOf(k) !== i);
    if (duplicate) {
      toast.error("Please do not choose the same medication twice");
      return;
    }
    const payload = {
      medicines: validMedications.map((m) => ({
        medicine_id: Number(m.medicine_id) || m.medicine_id,
        dose: Number(m.dose) || m.dose,
        notes: m.note || "",
      })),
      expired_date: expiryDate || null,
    };
    console.log("its the data annie ", payload);
    setIsSubmitting(true);
    try {
      await addPrescription(payload, id);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Prescription created successfully!");

      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false);
        setMedicationList([
          { id: 1, name: "", medicine_id: null, dose: "", note: "" },
        ]);
        setExpiryDate("");
      }, 3000);
      navigate(-1);
    } catch (err) {
      console.error("Error creating prescription:", err);
      setIsSubmitting(false);
      toast.error(
        err.message || "Failed to create prescription. Please try again.",
      );
    }
  };

  // if (isSuccess) {
  //   return (
  //     <div className={`${styles.centered} ${styles.fadeIn}`}>
  //       <div className={styles.card}>
  //         <div className={styles.iconWrapper}>
  //           <FileCheck className={styles.successIcon} />
  //         </div>
  //         <h2 className={styles.title}>Prescription Created!</h2>
  //         <p className={styles.subtitle}>
  //           The prescription has been sent to the patient and pharmacist.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Issue Prescription</h1>
        <p className={styles.pageSubtitle}>
          Create a new prescription for your patient
        </p>
      </div>

      <div className={styles.grid}>
        {/* Main Form */}
        <div className={styles.mainForm}>
          {/* Medications */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              <Pill size={28} className={styles.icon} /> Medications
            </h2>

            <div className={styles.medList}>
              {medicationList.map((med, index) => (
                <div key={med.id} className={styles.medCard}>
                  <div className={styles.medHeader}>
                    <span>Medication #{index + 1}</span>
                    {medicationList.length > 1 && (
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeMedication(med.id)}
                      >
                        <Trash2 className={styles.removeIcon} />
                      </button>
                    )}
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Medicine Name</label>
                      <AsyncSelect
                        cacheOptions
                        loadOptions={loadMedications}
                        value={
                          med.medicine_id
                            ? { label: med.name, value: med.medicine_id }
                            : med.name
                              ? { label: med.name, value: med.name }
                              : null
                        }
                        onChange={(option) => {
                          updateMedication(
                            med.id,
                            "medicine_id",
                            option?.value ?? null,
                          );
                          updateMedication(med.id, "name", option?.label || "");
                        }}
                        onInputChange={(inputValue, { action }) => {
                          // When user types, clear any previously selected medicine_id
                          if (action === "input-change") {
                            updateMedication(med.id, "name", inputValue || "");
                            updateMedication(med.id, "medicine_id", null);
                          }
                        }}
                        placeholder="Search medication..."
                        styles={selectStyles}
                        isClearable
                        noOptionsMessage={({ inputValue }) =>
                          !inputValue || inputValue.length < 2
                            ? "Type at least 2 characters to search"
                            : `No medications found for "${inputValue}"`
                        }
                        loadingMessage={() => "Searching medications..."}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Dose / Frequency</label>
                      <input
                        type="text"
                        placeholder="e.g., 1 tablet twice daily"
                        value={med.dose}
                        onChange={(e) =>
                          updateMedication(med.id, "dose", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.field} style={{ marginTop: 8 }}>
                    <label>Notes for this medication (optional)</label>
                    <textarea
                      placeholder="e.g., take with food, avoid driving..."
                      value={med.note || ""}
                      onChange={(e) =>
                        updateMedication(med.id, "note", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              <button className={styles.addBtn} onClick={addMedication}>
                <Plus className={styles.addIcon} /> Add Another Medication
              </button>
            </div>

            {/* removed General Notes per request */}
            <div className={styles.field} style={{ marginTop: "12px" }}>
              <label>
                Prescription Expiry Date (applies to all medications)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary & Submit */}
        <div className={styles.summary}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              <FileText size={28} className={styles.icon} /> Prescription
              Summary
            </h2>

            <div className={styles.summaryRow}>
              <span>Patient</span>
              <span>{patientname}</span>
            </div>

            {/* {patientname && (
              <>
                <div className={styles.summaryRow}>
                  <span>Age</span>
                  <span>{patient.age} years</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Gender</span>
                  <span>{patient.gender}</span>
                </div>
              </>
            )} */}

            <div className={styles.summaryRow}>
              <span>Medications</span>
              <span>{medicationList.filter((m) => m.name).length} items</span>
            </div>

            {expiryDate && (
              <div className={styles.summaryRow}>
                <span>Expires</span>
                <span>{expiryDate}</span>
              </div>
            )}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div> Creating...
                </>
              ) : (
                <>
                  <Check className={styles.submitIcon} /> Create Prescription
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
