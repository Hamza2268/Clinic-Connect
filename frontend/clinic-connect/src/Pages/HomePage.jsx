import Footer from "../Components/Footer";
import styles from "../Style/HomePage.module.css";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import PersonalInjuryOutlinedIcon from "@mui/icons-material/PersonalInjuryOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import { useRef } from "react";
import { NavLink } from "react-router-dom";
import Snowfall from "react-snowfall";

function HomePage() {
  const HomeSecRef = useRef(null);
  const FeaturesSecRef = useRef(null);
  const RolesSecRef = useRef(null);

  return (
    <>
      <nav className={styles.navigationBar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Diversity2Icon style={{ color: "white", fontSize: 30 }} />
          </div>
          <div className={styles.logoText}>Clinic Connect</div>
        </div>
        <div className={styles.navigationItems}>
          <button
            onClick={() =>
              HomeSecRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Home
          </button>
          <button
            onClick={() =>
              FeaturesSecRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Features
          </button>
          <button
            onClick={() =>
              RolesSecRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Roles
          </button>
          <button>
            {" "}
            <NavLink to="/SignUp">Sign Up</NavLink>
          </button>
          <button>
            <span className={styles.navigationItemsSpan}>
              <NavLink to="/Login">Log in</NavLink>
            </span>
          </button>
        </div>
      </nav>
      <div ref={HomeSecRef} className={styles.main}>
        <Snowfall color="white" snowflakeCount={500} />
        <img
          className={styles.backgroundWave}
          src="./Screenshot 2025-12-06 005857.png"
        />

        <section className={styles.HeroSection}>
          <div className={styles.heroText}>
            <div className={styles.heroTextTitle}>Clinic Connect</div>
            <div className={styles.heroTextDes}>
              A unified space that connects patients with doctors, pharmacists,
              and lab technicians . From booking appointments to checking
              prescriptions and viewing lab results, everything is accessible in
              one secure, easy-to-use platform designed to make healthcare
              simpler and more coordinated.
            </div>
          </div>
          <div className={styles.heroPic}>
            <img src="./HeroSectionPic.png" />
          </div>
        </section>
        <section ref={RolesSecRef} className={styles.Roles}>
          <div className={styles.RolesTitle}>
            Built for All Healthcare Professionals
          </div>
          <div className={styles.RolesTypes}>
            <div className={styles.RolesCard}>
              <div className={styles.RolesLogo}>
                <PersonalInjuryOutlinedIcon
                  style={{ color: "white", fontSize: 30 }}
                />
              </div>
              <div className={styles.RolesCardTitle}>For Patients</div>
              <div className={styles.RolesCardText}>
                Book Appointments, view medical records and communicate with
                your healthcare team seamlessly.
              </div>
              <div>
                <ul>
                  <li>Instant Appointments</li>
                  <li>Digital Health Records</li>
                  <li>Prescribtion Tracking</li>
                </ul>
              </div>
            </div>

            <div className={styles.RolesCard}>
              <div className={styles.RolesLogo}>
                <PersonalInjuryOutlinedIcon
                  style={{ color: "white", fontSize: 30 }}
                />
              </div>
              <div className={styles.RolesCardTitle}>For Doctors</div>
              <div className={styles.RolesCardText}>
                Manage patient records, issue prescriptions, track treatments,
                and coordinate care efficiently.
              </div>
              <div>
                <ul>
                  <li>Patient Management</li>
                  <li>E-Prescriptions</li>
                  <li>Labs requests</li>
                </ul>
              </div>
            </div>

            <div className={styles.RolesCard}>
              <div className={styles.RolesLogo}>
                <VaccinesOutlinedIcon
                  style={{ color: "white", fontSize: 30 }}
                />
              </div>
              <div className={styles.RolesCardTitle}>For Pharmacist</div>
              <div className={styles.RolesCardText}>
                Handle prescriptions, manage inventory, coordinate with patients
                and healthcare providers.
              </div>
              <div>
                <ul>
                  <li>Prescription Management</li>
                  <li>Inventory Control</li>
                  <li>Patient Communication</li>
                </ul>
              </div>
            </div>

            <div className={styles.RolesCard}>
              <div className={styles.RolesLogo}>
                <ScienceOutlinedIcon style={{ color: "white", fontSize: 30 }} />
              </div>
              <div className={styles.RolesCardTitle}>For Lab Technicians</div>
              <div className={styles.RolesCardText}>
                Receive test requests, schedule sample collection, and upload
                results securely.
              </div>
              <div>
                <ul>
                  <li>Sample Scheduling</li>
                  <li>Result Upload</li>
                  <li>Inventory Control</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.steps}>
          <div className={styles.stepsTitle}>
            How <span className={styles.stepsTitleSpan}>Clinic Connect</span>{" "}
            Works
          </div>
          <div className={styles.stepsContent}>
            <div className={styles.stepsTextContainer}>
              <p className={styles.stepsTextTitle}>
                <span className={styles.stepsTextSpan}>01 </span>Create your
                Account
              </p>
              <p className={styles.stepsTextDescribtion}>
                Sign up and choose your role as a patient ,doctor,pharmacist or
                lab technician
              </p>
            </div>

            <div className={styles.stepsTextContainer}>
              <p className={styles.stepsTextTitle}>
                <span className={styles.stepsTextSpan}>02 </span> Connect with
                Healthcare Providers
              </p>
              <p className={styles.stepsTextDescribtion}>
                Schedule appointments, request services, and stay updated.
              </p>
            </div>

            <div className={styles.stepsTextContainer}>
              <p className={styles.stepsTextTitle}>
                {" "}
                <span className={styles.stepsTextSpan}>03 </span> Receive
                Coordinated Care
              </p>
              <p className={styles.stepsTextDescribtion}>
                Sign up and choose your role as a patient ,doctor,pharmacist or
                lab technician
              </p>
            </div>
          </div>
        </section>

        <section ref={FeaturesSecRef} className={styles.Features}>
          <div className={styles.FeaturesTitle}>
            Everything You Need for Seamless Healthcare
          </div>
          <div className={styles.FeaturesGrid}>
            <div className={styles.FeaturesGridCard}>
              <p className={styles.FeaturesGridCardTitle}>Book Appointments</p>
              <p>Find doctors and reserve time in a few taps.</p>
            </div>
            <div className={styles.FeaturesGridCard}>
              <p className={styles.FeaturesGridCardTitle}>Medical Records</p>
              <p>Access diagnoses and treatment history anytime.</p>
            </div>
            <div className={styles.FeaturesGridCard}>
              <p className={styles.FeaturesGridCardTitle}>Prescriptions</p>
              <p>View prescriptions, request refills, and track orders.</p>
            </div>
            <div className={styles.FeaturesGridCard}>
              <p className={styles.FeaturesGridCardTitle}>Lab Results</p>
              <p>Receive test results instantly and securely.</p>
            </div>
            <div className={styles.FeaturesGridCard}>
              <p className={styles.FeaturesGridCardTitle}>Medication Orders</p>
              <p>Order medicines directly from pharmacies near you.</p>
            </div>
            <div className={styles.FeaturesGridCard}>
              <p className={styles.FeaturesGridCardTitle}>Secure Messaging</p>
              <p>Communicate with doctors and pharmacists safely.</p>
            </div>
          </div>
        </section>

        <section className={styles.CallToAction}>
          <p className={styles.CallToActionTitle}>
            Ready to Transform Your{" "}
            <span className={styles.stepsTitleSpan}>
              Healthcare Experience?
            </span>
          </p>
          <p className={styles.CallToActionDescribtion}>
            Join thousands of healthcare professionals and patients already
            using Clinic Connect
          </p>
          <button className={styles.CallToActionBtn}>
            {" "}
            <NavLink to="/Signup">Get Started Now →</NavLink>
          </button>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
