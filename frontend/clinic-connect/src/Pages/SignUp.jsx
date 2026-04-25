import { useContext, useState } from "react";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import styles from "../Style/SignUp.module.css";
import { AuthContext } from "../Context/AuthProviderContext";
import { toast, Toaster } from "sonner";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [roleData, setRoleData] = useState({});
  const roles = ["patient", "doctor", "pharmacist", "lab_technician"];
  const { signup, loading } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const [generalData, setGeneralData] = useState({
    name: "",
    birth_date: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    role: "",
    passwordConfirm: "",
    photo: "",
  });

  const generalValid =
    generalData.name &&
    generalData.birth_date &&
    generalData.email &&
    generalData.password &&
    generalData.phone &&
    generalData.gender &&
    generalData.role &&
    generalData.passwordConfirm;

  const requiredRoleFields = {
    patient: ["blood_type", "address", "emergencyContacts"],
    doctor: [
      "about",
      "address",
      "license",
      "specialization",
      "appointment_fees",
      "Years_of_Experience",
      "about",
    ],
    pharmacist: [
      "about",
      "pharmacy_name",
      "opening_time",
      "closing_time",
      "contactNumber",
      "address",
      "license",
    ],
    lab_technician: [
      "about",
      "lab_name",
      "opening_time",
      "closing_time",
      "contactNumber",
      "address",
      "license",
    ],
  };

  const roleValid = requiredRoleFields[generalData.role]?.every((field) => {
    const value = roleData[field];

    // Handle arrays (like emergencyContacts)
    if (Array.isArray(value)) {
      return value.length > 0 && value[0] && value[0].trim() !== "";
    }

    // Handle regular strings
    return value && value.trim() !== "";
  });

  const handleGeneralChange = (field, value) => {
    setGeneralData({
      ...generalData,
      [field]: value,
    });
  };

  const handleRoleChange = (field, value) => {
    setRoleData({
      ...roleData,
      [field]: value,
    });
  };

  const handleSignUp = async () => {
    try {
      // Combine general data and role-specific data
      const userData = {
        ...generalData,
        ...roleData,
      };

      console.log(userData);
      // Call signup from AuthContext
      await signup(userData);

      // Optional: Show success message or redirect
      toast.success("Account created successfully!");
      navigate("/Login");
    } catch (error) {
      // Handle error
      toast.error(
        "Signup failed. Please try again.(Make sure phone num is 5 digits )"
      );
      console.error("Signup error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
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
        <div className={styles.card}>
          <div className={styles.header}>
            <button
              className={styles.backBtn}
              onClick={() => {
                step == 1 ? navigate(-1) : setStep(1);
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <div className={styles.logoIcon}>
            <Diversity2Icon style={{ color: "white", fontSize: 30 }} />
          </div>
          <div className={styles.logoText}>Sign Up</div>
          <p className={styles.subtitle}>
            Enter your details below to create your account and get started
          </p>

          {step === 1 && (
            <>
              <p className={styles.sectionTitle}>Select your Role</p>
              <div className={styles.roleButtons}>
                {roles.map((role) => (
                  <button
                    key={role}
                    className={`${styles.btn} ${
                      generalData.role === role ? styles.selectedBtn : ""
                    }`}
                    onClick={() => handleGeneralChange("role", role)}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={generalData.name}
                    onChange={(e) =>
                      handleGeneralChange("name", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Birth date</label>
                  <input
                    type="date"
                    value={generalData.birth_date}
                    onChange={(e) =>
                      handleGeneralChange("birth_date", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="text"
                    value={generalData.email}
                    onChange={(e) =>
                      handleGeneralChange("email", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    value={generalData.password}
                    onChange={(e) =>
                      handleGeneralChange("password", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone number</label>
                  <input
                    type="text"
                    value={generalData.phone}
                    onChange={(e) =>
                      handleGeneralChange("phone", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label> Confirm Password</label>
                  <input
                    type="password"
                    value={generalData.passwordConfirm}
                    onChange={(e) =>
                      handleGeneralChange("passwordConfirm", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroupFull}>
                  <label>Gender</label>
                  <div className={styles.genderContainer}>
                    <button
                      type="button"
                      className={`${styles.btn} ${
                        generalData.gender === "Male" ? styles.selectedBtn : ""
                      }`}
                      onClick={() => handleGeneralChange("gender", "Male")}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${
                        generalData.gender === "Female"
                          ? styles.selectedBtn
                          : ""
                      }`}
                      onClick={() => handleGeneralChange("gender", "Female")}
                    >
                      Female
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Upload Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleGeneralChange("photo", e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  {preview && <img src={preview} width={200} height={200} />}
                </div>
              </div>

              <button
                className={`${styles.btn} ${styles.confirmBtn}`}
                disabled={!generalValid}
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className={styles.sectionTitle}>
                Additional Information ({generalData.role})
              </h3>
              <div className={styles.formContainer}>
                {/* -------- Patient -------- */}
                {generalData.role === "patient" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Blood Type</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("blood_type", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Address</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("address", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label>Emergency Contact</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("emergencyContacts", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                {/* -------- Doctor -------- */}
                {generalData.role === "doctor" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Clinic Address</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("address", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>License</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("license", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Specialization</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("specialization", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Appointment Fees</label>
                      <input
                        type="number"
                        onChange={(e) =>
                          handleRoleChange("appointment_fees", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Years of Experience</label>
                      <input
                        type="number"
                        onChange={(e) =>
                          handleRoleChange(
                            "Years_of_Experience",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label>About</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("about", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                {/* -------- Pharmacist -------- */}
                {generalData.role === "pharmacist" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Pharmacy Name</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("pharmacy_name", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Pharmacy Location</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("address", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Opening Time</label>
                      <input
                        type="time"
                        onChange={(e) =>
                          handleRoleChange("opening_time", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Closing Time</label>
                      <input
                        type="time"
                        onChange={(e) =>
                          handleRoleChange("closing_time", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Pharmacy Number</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("contactNumber", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>License</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("license", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label>About</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("about", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                {/* -------- Lab Technician -------- */}
                {generalData.role === "lab_technician" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Lab Name</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("lab_name", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Lab Location</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("address", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Opening Time</label>
                      <input
                        type="time"
                        onChange={(e) =>
                          handleRoleChange("opening_time", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Closing Time</label>
                      <input
                        type="time"
                        onChange={(e) =>
                          handleRoleChange("closing_time", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Lab Contact Number</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("contactNumber", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>License</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("license", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label>About</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleRoleChange("about", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                className={`${styles.btn} ${styles.confirmBtn}`}
                disabled={!roleValid}
                onClick={handleSignUp}
              >
                Confirm
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
