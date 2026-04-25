import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./MyPatientProfile.module.css";
import { MapPin, Phone, ArrowLeft } from "lucide-react";
import { MedicalRecordContext } from "../../Context/MedicalRecordContext";
import { PrescriptionContext } from "../../Context/PrescriptionContext";
import { LabContext } from "../../Context/LabProvider";
import { PatientsContext } from "../../Context/PatientsProvider";
import { CircularProgress } from "@mui/material";

const fakeuser = {
  patient: {
    id: 39,
    name: "Sarah Ahmed",
    age: 29,
    bloodType: "A+",
    address: "Nasr City, Cairo",
    emergencyContact: "01234567890",
    notes: "Follow-up in two weeks",
  },

  records: [
    {
      id: 101,
      date: "2025-02-03",
      diagnosis: "Acute Sinusitis",
      treatment: "Amoxicillin 500mg for 7 days",
      notes: "Patient reported heavy facial pressure",
    },
    {
      id: 102,
      date: "2025-01-21",
      diagnosis: "Migraine",
      treatment: "Rest, hydration, Ibuprofen 400mg",
      notes: "Recurring migraines after stress",
    },
  ],

  prescriptions: [
    {
      id: 40,
      date: "2025-02-03",
      notes: "Take after food",
      medicines: [
        { name: "Amoxicillin", dose: "500mg — twice daily" },
        { name: "Panadol Extra", dose: "3 times daily" },
      ],
    },
    {
      id: 41,
      date: "2025-01-21",
      notes: "Avoid caffeine",
      medicines: [{ name: "Ibuprofen", dose: "400mg — as needed" }],
    },
  ],

  labResults: [
    {
      testId: 11,
      testName: "Complete Blood Count (CBC)",
      date: "2025-02-02",
      status: "Completed",
      result: "Normal values. No abnormalities detected.",
    },
    {
      testId: 12,
      testName: "COVID-19 PCR",
      date: "2025-02-01",
      status: "Completed",
      result: "Negative",
    },
    {
      testId: 13,
      testName: "Thyroid Function Test",
      date: "2025-01-20",
      status: "Pending",
      result: "",
    },
  ],
};

function MyPatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(fakeuser.patient);
  const [activeTab, setActiveTab] = useState("records");

  // Data inside tabs
  // const [medicalRecords, setMedicalRecords] = useState(fakeuser.records);
  // const [prescriptions, setPrescriptions] = useState(fakeuser.prescriptions);
  // const [labResults, setLabResults] = useState(fakeuser.labResults);

  const {
    getMedicalRecordForDoctor,
    patientMedicalRecords,
    loading: load1,
  } = useContext(MedicalRecordContext);
  const {
    getPatientPrescriptions,
    prescriptions: fetchedPrescriptions,
    loading: load2,
  } = useContext(PrescriptionContext);
  const {
    getPatientLabTests,
    patientTest,
    loading: load3,
  } = useContext(LabContext);
  const {
    getPatientById,
    patientInfo: fetchedPatient,
    loading: load4,
  } = useContext(PatientsContext);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------
  // FETCH patient data
  // ------------------------------------------
  useEffect(() => {
    // start fetch and show spinner immediately
    setLoading(true);
    getMedicalRecordForDoctor(id);
    getPatientPrescriptions(id);
    getPatientLabTests(id);
    getPatientById(id);
  }, [id]);

  // keep local loading synced with context loading flags
  useEffect(() => {
    setLoading(Boolean(load1 || load2 || load3 || load4));
  }, [load1, load2, load3, load4]);

  // ------------------------------------------
  // PAGE UI
  // ------------------------------------------

  if (loading)
    return (
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
    );

  return (
    <div className={styles.profileContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back to Patients
      </button>
      <div className={styles.patientInfoWrapper}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              {" "}
              {fetchedPatient?.img ? (
                <img src={fetchedPatient.img} alt="Avatar" />
              ) : (
                "P"
              )}
            </div>

            <div>
              <h2 className={styles.patientName}>{fetchedPatient?.name}</h2>
              <div className={styles.detailsRow}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>👤</span>
                  <span>
                    Birth Date :{fetchedPatient?.birth_date?.split("T")[0]}{" "}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🩸</span>
                  <span>
                    Blood Type: <strong>{fetchedPatient?.blood_type}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BODY GRID */}
        <div className={styles.bodyGrid}>
          <div className={styles.infoBox}>
            <div className={`${styles.iconBox} ${styles.blueIcon}`}>
              <MapPin />
            </div>
            <div>
              <p className={styles.label}>Address</p>
              <p className={styles.value}>{fetchedPatient?.address}</p>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={`${styles.iconBox} ${styles.greenIcon}`}>
              <Phone />
            </div>
            <div>
              <p className={styles.label}>Emergency Contact</p>
              <p className={styles.value}>{fetchedPatient?.emergency_phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "records" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("records")}
        >
          Medical Records
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "prescriptions" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("prescriptions")}
        >
          Prescriptions
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "results" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("results")}
        >
          Lab Results
        </button>
      </div>

      {/* ------------------------ */}
      {/* TAB: MEDICAL RECORDS */}
      {/* ------------------------ */}
      {activeTab === "records" && (
        <div>
          <div className={styles.sectionHeader}>
            <h2>Medical Records</h2>
          </div>

          <div className={styles.recordsList}>
            {(Array.isArray(patientMedicalRecords)
              ? patientMedicalRecords
              : []
            ).map((rec) => (
              <div key={rec.record_id} className={styles.recordCard}>
                <p>
                  <strong>Date:</strong> {rec.created_at?.split("T")[0]}
                </p>
                <p>
                  <strong>Diagnosis:</strong> {rec.diagnose}
                </p>
                <p>
                  <strong>Treatment:</strong> {rec.treatment_plan}
                </p>
                <p>
                  <strong>Notes:</strong> {rec.notes || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------ */}
      {/* TAB: PRESCRIPTIONS */}
      {/* ------------------------ */}
      {activeTab === "prescriptions" && (
        <div className={styles.recordsList}>
          <h2>Prescriptions</h2>

          {fetchedPrescriptions.map((p) => (
            <div key={p.prescriptionId} className={styles.recordCard}>
              <p>
                <strong>Date:</strong> {p.date?.split("T")[0]}
              </p>
              <p>
                <strong>expired date:</strong> {p.expiredDate?.split("T")[0]}
              </p>

              <p>
                <strong>Medications:</strong>
              </p>
              <ul>
                {p.medications.map((m, i) => (
                  <li key={i}>
                    {m.name} — {m.dose} - {m.note}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------ */}
      {/* TAB: LAB RESULTS */}
      {/* ------------------------ */}
      {activeTab === "results" && (
        <div className={styles.recordsList}>
          <h2>Lab Results</h2>

          {patientTest.map((r) => (
            <div key={r.labtest_id} className={styles.recordCard}>
              <p>
                <strong>Test:</strong> {r.test_name}
              </p>
              <p>
                <strong>Date:</strong> {r.test_date?.split("T")[0]}
              </p>
              <p>
                <strong>Status:</strong> {r.status}
              </p>
              <p>
                <strong>Result:</strong> {r.result_url || "Pending..."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPatientProfile;
