import styles from "./MyPatientsPage.module.css";
import { User } from "lucide-react";

function PatientCard({ patient, index, openProfile }) {
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 60}ms` }}>
      <div className={styles.cardContent}>
        <div>
          <p className={styles.label}>Patient</p>
          <h3 className={styles.name}>{patient?.name}</h3>

          <p className={styles.subtext}>
            Total Appointments:{" "}
            <span className={styles.value}>{patient?.appointments}</span>
          </p>

          <p className={styles.subtext}>
            Records:{" "}
            <span className={styles.value}>
              {patient?.medicalRecords || "-"}
            </span>
          </p>
        </div>

        <div className={styles.iconBox}>
          <User className={styles.icon} />
        </div>
      </div>

      <button
        className={styles.viewBtn}
        onClick={() => openProfile(patient.id)}
      >
        View Profile →
      </button>
    </div>
  );
}

export default PatientCard;
