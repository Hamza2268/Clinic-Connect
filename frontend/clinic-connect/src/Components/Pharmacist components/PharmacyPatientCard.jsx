import styles from "./PharmacyPatients.module.css";
import { User } from "lucide-react";

function PharmacyPatientCard({ patient, index, openProfile }) {
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 60}ms` }}>
      <div className={styles.cardContent}>
        <div>
          <p className={styles.label}>Patient</p>
          <h3 className={styles.name}>{patient.name}</h3>

          <p className={styles.subtext}>
            Last Pickup:{" "}
            <span className={styles.value}>
              {patient?.lastPickup ? patient.lastPickup?.split("T")[0] : "—"}
            </span>
          </p>

          <p className={styles.subtext}>
            Prescribtions/Orders:{" "}
            <span className={styles.value}>{patient?.prescriptions}</span>
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

export default PharmacyPatientCard;
