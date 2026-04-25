import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./MyPatientsPage.module.css";
import PatientCard from "./PatientCard";
import { Hospital, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { PatientsContext } from "../../Context/PatientsProvider";
import CircularProgress from "@mui/material/CircularProgress";
function MyPatientsPage() {
  const navigate = useNavigate();
  const { searchValue = "" } = useOutletContext() || {};
  const { fetchPatients, loading, error, patients, totalPatients } =
    useContext(PatientsContext);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const openProfile = (id) => {
    navigate(`/Doctor/patient/${id}`);
  };

  useEffect(() => {
    // reset to first page when search changes
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    fetchPatients(page, itemsPerPage, searchValue);
  }, [page, searchValue]);

  return (
    <div className={styles.patientspagecontainer}>
      <div className={styles.pageheader}>
        <div className={styles.titlewrapper}>
          <Hospital size={40} />
          <h1 className={styles.pagetitle}>My Patients</h1>
        </div>
        <div className={styles.totalpatients}>
          <Users size={28} /> {totalPatients} Total Patients
        </div>
      </div>

      {/* Loading State */}
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
          {/* Empty State */}
          {patients?.length === 0 && (
            <p className={styles.emptytext}>No patients found.</p>
          )}

          {/* Patients List */}
          <div className={styles.patientslist}>
            {patients?.map((patient, i) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                openProfile={openProfile}
                index={i}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className={styles.pagination} style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={styles.pageBtn}
            >
              Prev
            </button>

            <div style={{ minWidth: 140, textAlign: 'center' }}>
              Page {page} of {Math.max(1, Math.ceil((totalPatients || 0) / itemsPerPage))}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.max(1, Math.ceil((totalPatients || 0) / itemsPerPage))}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MyPatientsPage;
