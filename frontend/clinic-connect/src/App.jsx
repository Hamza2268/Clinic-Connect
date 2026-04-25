import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import AppointmentsPage from "./Pages/Appointments";
import DoctorPage from "./Pages/DoctorPage";
import MyPatientProfile from "./Components/Doctor's components/MyPatientProfile";
import MyPatientsPage from "./Components/Doctor's components/MyPatientsPage";
import Appointments from "./Components/Doctor's components/Appointments";
import Prescribe from "./Components/Doctor's components/Prescribe";
import LabRequests from "./Components/Doctor's components/LabRequests";
import ShiftSchedule from "./Components/Doctor's components/ShiftSchedule";
import Settings from "./Pages/Settings";
import Home from "./Pages/Service";
import DoctorProfile from "./Pages/DoctorProfile";
import PharmacyProfile from "./Pages/PharmacyProfile";
import LabProfile from "./Pages/LabProfile";
import Toast from "./Components/Toaster";
import NotFound from "./Pages/NotFound";
import LabTest from "./Pages/LabTest";
import Prescription from "./Pages/Prescription";
import ScrollToTheTop from "./Hooks/ScrollToTheTop";
import MedicalRecords from "./Pages/MedicalRecord";
import Orders from "./Pages/Orders";
import AdminDashBoard from "./Pages/Admin Pages/DashBoard";
import AdminManagement from "./Pages/Admin Pages/AdminManagement";
import UserManagement from "./Pages/Admin Pages/UserManagement";
import Reports from "./Pages/Admin Pages/Reports";
import Medications from "./Pages/Admin Pages/Medication";
import LabExaminations from "./Pages/Admin Pages/LabExamination";
import AdminProfile from "./Pages/Admin Pages/AdminProfile";
import { Toaster } from "sonner";
import MedicalRecord from "./Components/Doctor's components/MedicalRecord";
import Pharmacist from "./Pages/Pharmacist";
import Prescriptions from "./Components/Pharmacist components/Prescriptions";
import { AuthProvider } from "./Context/AuthProviderContext";
import Inventory from "./Components/Pharmacist components/Inventory";
import PharmacyPatients from "./Components/Pharmacist components/PharmacyPatients";
import PharmacyPatientProfile from "./Components/Pharmacist components/PharmacyPatientProfile";
import { AppointmentsProvider } from "./Context/AppointmentsContext";
import LabTechnician from "./Pages/LabTechnician";
import LabTestsRequests from "./Components/Lab Technician Components/LabTestsRequests";
import LabInventory from "./Components/Lab Technician Components/LabInventory";
import LabPatients from "./Components/Lab Technician Components/LabPatients";
import LabPatientProfile from "./Components/Lab Technician Components/LabPatientProfile";
import { PatientsProvider } from "./Context/PatientsProvider";
import PatientHomePage from "./Pages/PatientHomePage";
import { DoctorsProvider } from "./Context/DoctorsContext";
import { ServicesProvider } from "./Context/ServicesContext";
import { LabProvider } from "./Context/LabProvider";
import { PrescriptionsProvider } from "./Context/PrescriptionContext";
import { LabTestProvider } from "./Context/LabTestContext";
import { MedicalRecordProvider } from "./Context/MedicalRecordContext";
import { MedicalOrderProvider } from "./Context/MedicalOrderContext";

import PharmacyProvider from "./Context/PharmacyProvider";

import { AdminProvider } from "./Context/AdminContext";
import { Notifications } from "@mui/icons-material";
import { NotificationsProvider } from "./Context/NotificationsContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTheTop />
        <AuthProvider>
          <ServicesProvider>
            <MedicalRecordProvider>
              <MedicalOrderProvider>
                <AppointmentsProvider>
                  <LabTestProvider>
                    <PrescriptionsProvider>
                      <PatientsProvider>
                        <DoctorsProvider>
                          <LabProvider>
                            <AdminProvider>
                              <PharmacyProvider>
                                <NotificationsProvider>
                                  <Toaster position="top-right" />
                                  <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route
                                      path="/Login"
                                      element={<LoginPage />}
                                    />
                                    <Route
                                      path="/SignUp"
                                      element={<SignUp />}
                                    />
                                    <Route
                                      path="/Profile"
                                      element={<PatientHomePage />}
                                    />

                                    <Route
                                      path="/Doctor"
                                      element={<DoctorPage />}
                                    >
                                      <Route
                                        index
                                        element={<MyPatientsPage />}
                                      />
                                      <Route
                                        path="patients"
                                        element={<MyPatientsPage />}
                                      />
                                      <Route
                                        path="patient/:id"
                                        element={<MyPatientProfile />}
                                      />
                                      <Route
                                        path="appointments"
                                        element={<Appointments />}
                                      />
                                      <Route
                                        path="prescribe/:id/:name"
                                        element={<Prescribe />}
                                      />
                                      <Route
                                        path="labRequests/:id/:name"
                                        element={<LabRequests />}
                                      />
                                      <Route
                                        path="MedicalRecord/:id/:name"
                                        element={<MedicalRecord />}
                                      />
                                      <Route
                                        path="shiftSchedule"
                                        element={<ShiftSchedule />}
                                      />
                                    </Route>

                                    <Route
                                      path="/Admin"
                                      element={<AdminDashBoard />}
                                    />
                                    <Route
                                      path="/Admin/DashBoard"
                                      element={<AdminDashBoard />}
                                    />
                                    <Route
                                      path="/Admin/Management"
                                      element={<AdminManagement />}
                                    />
                                    <Route
                                      path="/Admin/Users"
                                      element={<UserManagement />}
                                    />
                                    <Route
                                      path="/Admin/Medications"
                                      element={<Medications />}
                                    />
                                    <Route
                                      path="/Admin/LabExaminations"
                                      element={<LabExaminations />}
                                    />
                                    <Route
                                      path="/Admin/Reports"
                                      element={<Reports />}
                                    />
                                    <Route
                                      path="/Admin/Profile"
                                      element={<AdminProfile />}
                                    />

                                    <Route
                                      path="/Home"
                                      element={<PatientHomePage />}
                                    />
                                    <Route
                                      path="/Appointments"
                                      element={<AppointmentsPage />}
                                    />
                                    <Route
                                      path="/Services"
                                      element={<Home />}
                                    />
                                    <Route
                                      path="/Services/:Cat"
                                      element={<Home />}
                                    />
                                    <Route
                                      path="/Settings"
                                      element={<Settings />}
                                    />
                                    <Route
                                      path="/doctor/:id"
                                      element={<DoctorProfile />}
                                    />
                                    <Route
                                      path="/Pharmacy/:id"
                                      element={<PharmacyProfile />}
                                    />
                                    <Route
                                      path="/Lab/:id"
                                      element={<LabProfile />}
                                    />
                                    <Route
                                      path="/LabTests"
                                      element={<LabTest />}
                                    />
                                    <Route
                                      path="/Prescriptions"
                                      element={<Prescription />}
                                    />
                                    <Route
                                      path="/Records"
                                      element={<MedicalRecords />}
                                    />
                                    <Route
                                      path="/Orders"
                                      element={<Orders />}
                                    />
                                    {/* <Route path="/services" element={<Home />}>
                              <Route index element={<Doctors />} />
                              <Route path="doctors" element={<Doctors />} />
                              <Route path="pharmacies" element={<Pharmacies />} />
                              <Route path="labs" element={<Labs />} />
                            </Route> */}

                                    <Route
                                      path="/pharmacist"
                                      element={<Pharmacist />}
                                    >
                                      <Route
                                        index
                                        element={<Prescriptions />}
                                      />
                                      <Route
                                        path="prescriptions"
                                        element={<Prescriptions />}
                                      />
                                      <Route
                                        path="inventory"
                                        element={<Inventory />}
                                      />
                                      <Route
                                        path="patients"
                                        element={<PharmacyPatients />}
                                      />
                                      <Route
                                        path="patients/:id"
                                        element={<PharmacyPatientProfile />}
                                      />
                                      <Route
                                        path="settings"
                                        element={<Settings />}
                                      />
                                    </Route>

                                    <Route
                                      path="/labTechnician"
                                      element={<LabTechnician />}
                                    >
                                      <Route
                                        index
                                        element={<LabTestsRequests />}
                                      />
                                      <Route
                                        path="requests"
                                        element={<LabTestsRequests />}
                                      />
                                      <Route
                                        path="inventory"
                                        element={<LabInventory />}
                                      />
                                      <Route
                                        path="patients"
                                        element={<LabPatients />}
                                      />
                                      <Route
                                        path="patients/:id"
                                        element={<LabPatientProfile />}
                                      />
                                    </Route>

                                    <Route path="*" element={<NotFound />} />
                                  </Routes>
                                </NotificationsProvider>
                              </PharmacyProvider>
                            </AdminProvider>
                          </LabProvider>
                        </DoctorsProvider>
                      </PatientsProvider>
                    </PrescriptionsProvider>
                  </LabTestProvider>
                </AppointmentsProvider>
              </MedicalOrderProvider>
            </MedicalRecordProvider>
          </ServicesProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toast />
    </>
  );
}

export default App;
