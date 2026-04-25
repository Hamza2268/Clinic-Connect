import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Components/MainLayout.jsx";
import ProfileSidebar from "../Components/ProfileSidebar";
import ProfileHeader from "../Components/ProfileHeader";
import { AuthContext } from "../Context/AuthProviderContext.jsx";

// MUI
import { Container, Typography, Button, Avatar, Box } from "@mui/material";
import {
  Person,
  Edit,
  Lock,
  Security,
  ChevronRight,
  KeyboardArrowDown,
} from "@mui/icons-material";

// Bootstrap
import { Row, Col } from "react-bootstrap";

import styles from "../Style/Settings.module.css";
import { toast } from "sonner";

const requiredRoleFields = {
  patient: ["blood_type", "address", "emergency_contact"],
  doctor: [
    "doctor_about",
    "address",
    "doctor_license",
    "specialization",
    "appointment_fees",
    "years_of_experience",
  ],
  pharmacist: [
    "ph_about",
    "pharmacy_name",
    "ph_opening",
    "ph_closing",
    "phone",
    "address",
    "pharmacy_license",
  ],
  lab_technician: [
    "lab_about",
    "lab_name",
    "lab_opening",
    "lab_closing",
    "phone",
    "address",
    "lab_license",
  ],
};

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useContext(AuthContext);
  const userRole = user?.role;

  const [activeItem, setActiveItem] = useState("/settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [PasswordChanging, setPasswordChanging] = useState(false);

  const [generalData, setGeneralData] = useState({
    name: "Sarah Johnson",
    birth_date: "1999-06-12",
    email: "sarah@email.com",
    phone: "+1 555 123 456",
    gender: "Female",
  });

  useEffect(() => {
    if (!user) return;

    setGeneralData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      birth_date: user.birth_date?.split("T")[0] || "",
    });

    setPhotoPreview(user.img || null);
  }, [user]);

  const [roleData, setRoleData] = useState({});
  const [pass, setPass] = useState({});
  const [photo, setPhoto] = useState(user?.img || null); // new photo state
  const [photoPreview, setPhotoPreview] = useState(user?.img || null); // preview

  useEffect(() => {
    if (!user || !userRole) return;

    const fields = requiredRoleFields[userRole];
    const initial = {};
    fields?.forEach((f) => {
      initial[f] = user[f] ?? ""; // Pull from actual user data
    });
    setRoleData(initial);
  }, [userRole, user]);

  const handleItemClick = (href) => {
    if (href === "/" || href === "/logout") {
      navigate("/");
      return;
    }

    setActiveItem(href);
    setSidebarOpen(false);
    if (userRole === "doctor") {
      navigate("/Doctor" + href);
      return;
    }

    if (userRole === "pharmacist") {
      navigate("/pharmacist" + href);
      return;
    }
    if (userRole === "lab_technician") {
      navigate("/labTechnician" + href);
      return;
    }
    navigate(href);
  };

  const renderInput = (
    label,
    value,
    onChange,
    type = "text",
    forceDisabled = false
  ) => (
    <div className={styles.infoRow}>
      <div className={styles.infoContent}>
        <div className={styles.infoLabel}>{label}</div>
        <input
          className={`${styles.infoValue} ${
            isEditing && !forceDisabled ? styles.editable : styles.readOnly
          }`}
          type={type}
          value={value || ""}
          onChange={onChange}
          disabled={!isEditing || forceDisabled}
        />
      </div>
    </div>
  );

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const { doctor_about, ph_about, lab_about, ...restRoleData } = roleData;

      const payload =
        pass.new && pass.confirmnew
          ? {
              ...generalData,
              ...restRoleData,
              about: doctor_about || ph_about || lab_about, // Map to 'about
              passwordConfirm: pass.confirmnew,
              password: pass.new,
              photo,
            }
          : {
              ...generalData,
              ...restRoleData,
              about: doctor_about || ph_about || lab_about, // Map to 'about'
              photo,
            };

      console.log("before update prof");
      await updateProfile(payload);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setPasswordChanging(false);
      setPass({});
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.profileContainer}>
      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ""}`}
      >
        <ProfileSidebar
          userRole={userRole}
          userName={generalData.name}
          activeItem={activeItem}
          onItemClick={handleItemClick}
          expanded={sidebarOpen}
        />
      </div>

      <div className={styles.mainContent}>
        <ProfileHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          active={activeItem}
        />

        <main className={styles.mainSection}>
          <Container maxWidth="lg" disableGutters>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontFamily: "Alan Sans, Outfit" }}
              >
                Settings
              </Typography>

              {!isEditing ? (
                <Button
                  startIcon={<Edit />}
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </Box>

            <Row>
              <Col lg={6}>
                <div className={styles.settingsCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <Person /> Profile Information
                    </h3>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.profileSection}>
                      <Avatar className={styles.profileAvatar}>
                        {photoPreview ? (
                          <img src={photoPreview} alt="photo" />
                        ) : (
                          "P"
                        )}
                      </Avatar>
                      {isEditing && (
                        <div className={styles.photoInputWrapper}>
                          <div className={styles.photoInputText}>
                            Upload new Photo
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className={styles.photoInput}
                          />
                        </div>
                      )}
                      {!isEditing && (
                        <div className={styles.profileDetails}>
                          <h4 className={styles.profileName}>{user?.name}</h4>
                        </div>
                      )}
                    </div>

                    {renderInput("Name", generalData.name, (e) =>
                      setGeneralData({ ...generalData, name: e.target.value })
                    )}
                    {renderInput("Email", generalData.email, (e) =>
                      setGeneralData({ ...generalData, email: e.target.value })
                    )}
                    {renderInput("Phone", generalData.phone, (e) =>
                      setGeneralData({ ...generalData, phone: e.target.value })
                    )}
                    {renderInput("Gender", generalData.gender, (e) =>
                      setGeneralData({ ...generalData, gender: e.target.value })
                    )}
                    {renderInput(
                      "Birth Date",
                      generalData.birth_date.split("T")[0],
                      (e) =>
                        setGeneralData({
                          ...generalData,
                          birth_date: e.target.value,
                        })
                    )}
                  </div>
                </div>
              </Col>

              <Col lg={6}>
                <div className={styles.settingsCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      {userRole?.replace("_", " ").toUpperCase()} Details
                    </h3>
                  </div>

                  <div className={styles.cardBody}>
                    {requiredRoleFields[userRole]?.map((field) =>
                      renderInput(
                        field.replace(/_/g, " ").toUpperCase(),
                        roleData[field] ?? user[field],
                        field.includes("license")
                          ? null
                          : (e) =>
                              setRoleData({
                                ...roleData,
                                [field]: e.target.value,
                              }),
                        "text",
                        field.includes("license") ||
                          field.includes("specialization")
                      )
                    )}
                  </div>
                </div>

                <div
                  className={`${styles.settingsCard} ${styles.securityCard}`}
                >
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <Security /> Security
                    </h3>
                  </div>

                  <div className={styles.cardBody}>
                    <div
                      className={styles.securityRow}
                      onClick={() =>
                        isEditing && setPasswordChanging(!PasswordChanging)
                      }
                      style={{ opacity: isEditing ? 1 : 0.5 }}
                    >
                      <div className={styles.securityInfo}>
                        <Lock />
                        <div>
                          <h6>Change Password</h6>
                          <p>Update your password</p>
                        </div>
                      </div>
                      {PasswordChanging ? (
                        <KeyboardArrowDown />
                      ) : (
                        <ChevronRight />
                      )}
                    </div>

                    {PasswordChanging && (
                      <div className={styles.changePasswordSection}>
                        <input
                          type="password"
                          placeholder="New Password"
                          onChange={(e) =>
                            setPass({ ...pass, new: e.target.value })
                          }
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          onChange={(e) =>
                            setPass({ ...pass, confirmnew: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className={styles.saveWrapper}>
                    <Button
                      onClick={() => handleSave()}
                      variant="contained"
                      className={styles.saveButton}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}
