import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ArrowLeft, FlaskConical, ExternalLink } from "lucide-react";
import styles from "./LabPatientProfile.module.css";
import { LabContext } from "../../Context/LabProvider";
import CircularProgress from "@mui/material/CircularProgress";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

const isURL = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

function LabPatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getLabTechPatientInfo,
    patientInfo,
    patientInfoLabRequests,
    loading,
  } = useContext(LabContext);
  const getStatusClass = (status) => {
    return status.toLowerCase() === "completed"
      ? styles.statusCompleted
      : styles.statusPending;
  };

  useEffect(() => {
    getLabTechPatientInfo(id);
  }, [id]);

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back to Patients
      </button>

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
          {/* Patient Header */}
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {getInitials(patientInfo?.name)}
            </div>

            <div className={styles.profileInfo}>
              <h1>{patientInfo?.name}</h1>
              <p className={styles.email}>{patientInfo?.email}</p>
              <p className={styles.phone}>Contact: {patientInfo?.phone}</p>
            </div>
          </div>

          {/* Lab Test History */}
          <div className={styles.sectionHeader}>
            <FlaskConical size={24} />
            <h2>Lab Test History</h2>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Test Name</th>
                    <th>Requested By</th>
                    <th>Status</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {patientInfoLabRequests?.map((test) => (
                    <tr key={test.labTestId}>
                      <td>{test.date.split("T")[0]}</td>
                      <td>{test.testName}</td>
                      <td>{test.doctor ? test.doctor : "N/A"}</td>
                      <td>
                        <span className={getStatusClass(test.status)}>
                          {test.status}
                        </span>
                      </td>
                      <td>
                        {test.status === "Completed" && test.result ? (
                          isURL(test.result) ? (
                            <a
                              href={test.result}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.resultLink}
                            >
                              View Report <ExternalLink size={14} />
                            </a>
                          ) : (
                            <span className={styles.resultText}>
                              {test.result}
                            </span>
                          )
                        ) : (
                          <span className={styles.pendingText}>
                            {test.status === "cancelled"
                              ? "Cancelled"
                              : "Pending"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {patientInfoLabRequests?.length === 0 && (
                <p className={styles.empty}>No lab tests found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LabPatientProfile;
