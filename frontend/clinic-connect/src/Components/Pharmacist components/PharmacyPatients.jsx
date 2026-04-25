import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./PharmacyPatients.module.css";
import { ChevronLeft, ChevronRight, Pill, Users } from "lucide-react";
import PharmacyPatientCard from "./PharmacyPatientCard";
import { useContext, useEffect, useState } from "react";
import { PatientsContext } from "../../Context/PatientsProvider";
import CircularProgress from "@mui/material/CircularProgress";
function PharmacyPatients() {
  const navigate = useNavigate();
  const { searchValue = "" } = useOutletContext() || {};
  const {
    patients,
    fetchPharmacistPatients,
    totalPatients,
    totalPages,
    loading,
  } = useContext(PatientsContext);
  // Filter patients based on search value from context
  const [page, setPage] = useState(1);

  const itemsPerPage = 2;
  // ------------------------------------------
  // Navigate to patient profile
  // ------------------------------------------
  const openProfile = (id) => {
    navigate(`/pharmacist/patients/${id}`);
  };
  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    fetchPharmacistPatients(page, itemsPerPage, searchValue);
  }, [searchValue, page]);
  console.log("patients", patients);
  // ------------------------------------------
  // PAGE UI
  // ------------------------------------------
  return (
    <div className={styles.patientspagecontainer}>
      <div className={styles.pageheader}>
        <div className={styles.titlewrapper}>
          <Pill size={40} />
          <h1 className={styles.pagetitle}>Pharmacy Patients</h1>
        </div>
        <div className={styles.totalpatients}>
          <Users size={28} /> {totalPatients} Total Patients
        </div>
      </div>

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
              <PharmacyPatientCard
                key={patient.id}
                patient={patient}
                openProfile={openProfile}
                index={i}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {patients?.length > 0 && (
            <div
              className={styles.pagination}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={styles.pageBtn}
              >
                <ChevronLeft size={20} />
                Prev
              </button>
              <div style={{ minWidth: 140, textAlign: "center" }}>
                Page {page} of {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className={styles.pageBtn}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PharmacyPatients;
