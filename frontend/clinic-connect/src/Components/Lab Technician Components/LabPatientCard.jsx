import styles from "./LabPatients.module.css";
import { User } from "lucide-react";

function LabPatientCard({ patient, index, openProfile }) {
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 60}ms` }}>
      <div className={styles.cardContent}>
        <div>
          <p className={styles.label}>Patient</p>
          <h3 className={styles.name}>{patient?.name}</h3>

          <p className={styles.subtext}>
            Last Test:{" "}
            <span className={styles.value}>
              {patient?.last_test_date
                ? patient.last_test_date?.split("T")[0]
                : "—"}
            </span>
          </p>

          <p className={styles.subtext}>
            Total Tests:{" "}
            <span className={styles.value}>{patient?.tests_count}</span>
          </p>
        </div>

        <div className={styles.iconBox}>
          <User className={styles.icon} />
        </div>
      </div>

      <button
        className={styles.viewBtn}
        onClick={() => openProfile(patient.national_id)}
      >
        View Profile →
      </button>
    </div>
  );
}

export default LabPatientCard;
