import { useState } from "react";
import styles from "./LabTestCard.module.css";
import { Upload } from "lucide-react";

function isImage(value) {
  return typeof value === "string" && value.startsWith("http");
}

function LabTestCard({ data, onComplete, onCancel, onUploadResult }) {
  const [input, setInput] = useState("");

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.testName}>{data.test_name}</h3>
        <span className={`${styles.status} ${styles[data.status]}`}>
          {data.status}
        </span>
      </div>
      <p className={styles.meta}>
        <strong>Patient:</strong> {data?.patient_name}
      </p>
      <p className={styles.meta}>
        <strong>Doctor:</strong> {data.doctor_name ? data.doctor_name : "N/A"}
      </p>
      <p className={styles.meta}>
        <strong>Date Issued:</strong> {data.date?.split("T")[0]}
      </p>

      {/* RESULT DISPLAY */}
      {data.status === "completed" && data.result && (
        <div className={styles.resultBox}>
          {isImage(data.result) ? (
            <img src={data.result} alt="Lab result" />
          ) : (
            <p>{data.result}</p>
          )}
        </div>
      )}

      {/* ACTIONS */}
      {data.status === "assigned" && (
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => onCancel(data.labtest_id)}
          >
            Cancel
          </button>

          <button
            className={styles.completeBtn}
            onClick={() => onComplete(data.labtest_id)}
          >
            Mark Completed
          </button>
        </div>
      )}

      {/* UPLOAD RESULT */}
      {data.status === "completed" && !data.result && (
        <div className={styles.uploadBox}>
          <input
            type="text"
            placeholder="Paste result text "
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={() => onUploadResult(data.labtest_id, input)}>
            <Upload size={16} /> Upload Result
          </button>
        </div>
      )}
    </div>
  );
}

export default LabTestCard;
