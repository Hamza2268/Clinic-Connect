import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Stethoscope, Send } from "lucide-react";
import styles from "./MedicalRecord.module.css";
import { toast, Toaster } from "sonner";
import { DoctorsContext } from "../../Context/DoctorsContext";

const tempPatients = [
  { id: 11, name: "Sarah Ali" },
  { id: 22, name: "Mohamed Hassan" },
  { id: 8, name: "Omar Khaled" },
  { id: 44, name: "Mariam Youssef" },
];

const getInitials = (name) => {
  const parts = name.split(" ");
  return "kk";
};

function MedicalRecord() {
  const { id: patientId, name: patientname } = useParams();
  const { createMedicalRecord } = useContext(DoctorsContext);
  const patient = tempPatients.find((p) => p.id.toString() === patientId);
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRecord = async () => {
    setIsSubmitting(true);
    try {
      if (!diagnosis.trim() || !treatment.trim()) {
        toast.error("Diagnosis and treatment are required.");
        return;
      }

      const payload = {
        diagnose: diagnosis,
        treatment_plan: treatment,
      };

      console.log("Submitting medical record:", payload);
      await createMedicalRecord(payload, patientId);
      toast.success("Medical record added successfully!");
      navigate(-1);
    } catch (error) {
      console.log(error.message || "error failed to add medical record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      <h1 className={styles.pageTitle}>Add Medical Record</h1>

      {/* Patient Info */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>
          <Stethoscope size={28} className={styles.icon} />
          Patient Information
        </h2>

        <div className={styles.summaryRow}>
          <div className={styles.avatar}>
            {getInitials(patient?.name || "NA")}
          </div>
          <strong className={styles.patientName}>{patientname}</strong>
        </div>
      </div>

      {/* Minimal Record Form */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>
          <FileText size={28} className={styles.icon} />
          Medical Details
        </h2>

        <label className={styles.label}>Diagnosis *</label>
        <input
          type="text"
          className={styles.input}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter diagnosis..."
        />

        <label className={styles.label}>Treatment *</label>
        <textarea
          className={styles.textarea}
          rows="4"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          placeholder="Enter treatment plan..."
        />
      </div>

      <button
        className={styles.submitBtn}
        onClick={submitRecord}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Saving..."
        ) : (
          <div className={styles.submitContent}>
            <div>Save Record</div>
            <Send size={16} />
          </div>
        )}
      </button>
    </div>
  );
}

export default MedicalRecord;
