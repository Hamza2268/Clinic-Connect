import { Check, X, ClipboardList } from "lucide-react";
import styles from "./PrescriptionCard.module.css";

function PrescriptionCard({
  data,
  onApprove,
  onDispense,
  onReject,
  processingOrderId,
}) {
  const {
    order_id: id,
    patient_name: patientName,
    items: medicines,
    order_date: date,
    status,

    total_price,
  } = data;

  const statusText =
    status === "ready_for_pickup"
      ? "Ready for pickup"
      : status === "completed"
      ? "Received"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.patient}>{patientName}</h3>
        <span className={`${styles.status} ${styles[status]}`}>
          {statusText}
        </span>
      </div>
      <p className={styles.date}>Date: {date?.split("T")[0]}</p>

      <p className={styles.doctor}>Total Price: {total_price}</p>

      <div className={styles.medicineList}>
        {medicines?.map((m, i) => (
          <p key={i} className={styles.medicine}>
            {m.name} — {m.dosage} × {m.quantity}
          </p>
        ))}
      </div>

      <div className={styles.actions}>
        {status === "requested" && (
          <>
            <button
              className={styles.approve}
              onClick={() => onApprove(id)}
              disabled={processingOrderId === id}
            >
              <Check size={16} />{" "}
              {processingOrderId === id ? "Processing..." : "Approve"}
            </button>

            <button
              className={styles.reject}
              onClick={() => onReject(id)}
              disabled={processingOrderId === id}
            >
              <X size={16} />{" "}
              {processingOrderId === id ? "Processing..." : "Reject"}
            </button>
          </>
        )}

        {status === "ready_for_pickup" && (
          <button
            className={styles.dispense}
            onClick={() => onDispense(id)}
            disabled={processingOrderId === id}
          >
            <ClipboardList size={16} />{" "}
            {processingOrderId === id ? "Processing..." : "Mark as Received"}
          </button>
        )}
      </div>
    </div>
  );
}

export default PrescriptionCard;
