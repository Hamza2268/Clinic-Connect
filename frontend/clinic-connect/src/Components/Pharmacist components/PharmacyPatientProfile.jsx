import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from "./PharmacyPatientProfile.module.css";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { PatientsContext } from "../../Context/PatientsProvider";
import CircularProgress from "@mui/material/CircularProgress";
const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

function PharmacyPatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPharmacistPatientInfo, patientInfo, loading } =
    useContext(PatientsContext);
  const { patient, orders } = patientInfo || {};
  useEffect(() => {
    getPharmacistPatientInfo(id);
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
            <div className={styles.avatar}>{getInitials(patient?.name)}</div>

            <div className={styles.profileInfo}>
              <h1>{patient?.name}</h1>
              <p className={styles.email}>{patient?.email}</p>
              <p className={styles.phone}>Contact :{patient?.phone}</p>
            </div>
          </div>

          {/* Prescription History */}
          <h2>Prescription History</h2>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Order Date</th>
                    <th>Pickup Date </th>
                    <th>Medicines</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((p) => (
                    <tr key={p.orderId}>
                      <td>{p?.orderDate.split("T")[0]}</td>
                      <td>{p?.pickupDate.split("T")[0]}</td>
                      <td className={styles.meds}>
                        {p?.medications?.map((med, i) => {
                          const medLabel =
                            typeof med === "string"
                              ? med
                              : med?.name ||
                                med?.medication_name ||
                                med?.medicationId ||
                                med?.medication_id ||
                                JSON.stringify(med);
                          return <span key={i}>{medLabel}</span>;
                        })}
                      </td>
                      <td>
                        <span className={styles.status}>{p?.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders?.length === 0 && (
                <p className={styles.empty}>No prescriptions found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PharmacyPatientProfile;
