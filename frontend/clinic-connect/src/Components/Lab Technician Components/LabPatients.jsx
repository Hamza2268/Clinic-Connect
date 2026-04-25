import { useNavigate, useOutletContext } from "react-router-dom";
import { FlaskConical, Users } from "lucide-react";
import styles from "./LabPatients.module.css";
import LabPatientCard from "./LabPatientCard";
import { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LabContext } from "../../Context/LabProvider";
import CircularProgress from "@mui/material/CircularProgress";
function LabPatients() {
  const navigate = useNavigate();
  const { searchValue = "" } = useOutletContext() || {};
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Adjust this number as needed

  const { getLabTechPatients, totalPages, patientTest,totalPatients,loading } =
    useContext(LabContext);

  useEffect(() => {
    // Fetch patients when component mounts or page changes
    getLabTechPatients(currentPage, itemsPerPage, searchValue);
  }, [currentPage, searchValue]);

  console.log(patientTest);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // ------------------------------------------
  // Navigate to patient lab profile
  // ------------------------------------------
  const openProfile = (id) => {
    navigate(`/labTechnician/patients/${id}`);
  };

  // ------------------------------------------
  // PAGE UI
  // ------------------------------------------
  return (
    <div className={styles.patientspagecontainer}>
      <div className={styles.pageheader}>
        <div className={styles.titlewrapper}>
          <FlaskConical size={40} />
          <h1 className={styles.pagetitle}>Lab Patients</h1>
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

{!loading && <>



{/* Empty State */}
      {patientTest?.length === 0 && (
        <p className={styles.emptytext}>No patients found.</p>
      )}

      {/* Patients List */}
      <div className={styles.patientslist}>
        {patientTest?.map((patient, i) => (
          <LabPatientCard
            key={patient.national_id}
            patient={patient}
            openProfile={openProfile}
            index={i}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}

</>}

      
    </div>
  );
}

export default LabPatients;
