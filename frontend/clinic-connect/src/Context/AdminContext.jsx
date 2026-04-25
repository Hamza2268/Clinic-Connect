import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
    const { token, user } = useContext(AuthContext);
    const [TotalUsers, setTotalUsers] = useState(0);
    const [ActiveDoctors, setActiveDoctors] = useState(0);
    const [Patients, setPatients] = useState(0);
    const [Medications, setMedications] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Admins
    const [Admins, setAdmins] = useState([]);
    const [AdminsCount, setAdminsCount] = useState(0);
    const [activeAdminsCount, setactiveAdminsCount] = useState(0);


    //Users
    const [reqsUsers, setReqUsers] = useState([])
    const [Users, setUsers] = useState([])

    // Medications
    const [AdminMedications, setAdminMedications] = useState([])

    //Labs
    const [AdminLab, setAdminLab] = useState([])

    const [medications_count, setmedications_count] = useState([])
    const [medications_stock, setmedications_stock] = useState([])
    const [medication_companies, setmedication_companies] = useState([])



    // const fetchUsers = async () => {
    //     console.log("start");
    //     if (!token) {
    //         console.warn("⚠️ No token available for Admin Management fetch");
    //         return;
    //     }
    //     console.log(token);

    //     setUsersLoading(true)
    //     try {
    //         console.log("try");

    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         };

    //         const response = await axios.get('/api/v1/users/users', config)

    //         console.log("All Users", response.data.rows);
    //         setUsers(response?.data.rows);
    //     }
    //     catch (err) {
    //         console.error("❌ Error:", err.response?.data || err.message);
    //         setError(err.response?.data?.message || "Failed to fetch Users info");
    //         setUsersLoading(false)
    //     } finally {
    //         console.log("final");
    //         setUsersLoading(false)
    //     }
    // }

    // const fetchRequestedUsers = async () => {
    //     console.log("start");
    //     if (!token) {
    //         console.warn("⚠️ No token available for Admin Management fetch");
    //         return;
    //     }
    //     console.log(token);

    //     setreqsUsersLoading(true);
    //     try {
    //         console.log("try");

    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         };

    //         const response = await axios.get('/api/v1/Requests/', config)
    //         console.log("Req", response.data.rows);
    //         setReqUsers(response?.data.rows);
    //     }
    //     catch (err) {
    //         console.error("❌ Error:", err.response?.data || err.message);
    //         setError(err.response?.data?.message || "Failed to fetch Requested Users info");
    //         setreqsUsersLoading(false);
    //     } finally {
    //         console.log("final");
    //         setreqsUsersLoading(false);
    //     }
    // }

    const fetchDashboard = async () => {
        if (!token) {
            console.warn("⚠️ No token available for dashboard fetch");
            return;
        }
        console.log(token);
        setLoading(true);
        setError(null);

        try {
            // Set up axios config with token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const patientsRes = await axios.get('/api/v1/users/stats/patients-count', config)
            const doctorsRes = await axios.get('/api/v1/users/stats/doctors-count', config)
            const pharmacistsRes = await axios.get('/api/v1/users/stats/pharmacists-count', config)
            const labsRes = await axios.get('/api/v1/users/stats/labs-count', config)
            const adminsRes = await axios.get('/api/v1/users/stats/admins-count', config)
            const medsRes = await axios.get('/api/v1/users/stats/medications-count', config)
            const activeDocsRes = await axios.get('/api/v1/users/stats/active-doctors-today', config)

            const patients = Number(patientsRes?.data.count || 0);
            const doctors = Number(doctorsRes?.data.doctors || 0);
            const pharmacists = Number(pharmacistsRes?.data.count || 0);
            const labs = Number(labsRes.data?.count || 0);
            const admins = Number(adminsRes?.data.count || 0);
            const meds = Number(medsRes?.data.count || 0);
            const activeDocs = Number(activeDocsRes?.data.activeDoctors || 0);

            setPatients(patients);
            setMedications(meds);
            setActiveDoctors(activeDocs);

            // Total users = sum of known roles
            setTotalUsers(patients + doctors + pharmacists + labs);
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to load dashboard info");
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminManagement = async () => {
        console.log("start");
        if (!token) {
            console.warn("⚠️ No token available for Admin Management fetch");
            return;
        }
        console.log(token);
        setLoading(true);
        setError(null);

        try {
            // Set up axios config with token
            console.log("try");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            console.log("📡 Fetching admins count...");
            const adminsRes = await axios.get('/api/v1/users/stats/admins-count', config)

            console.log("📡 zstuive admins count...");
            const activeAdminsRes = await axios.get('/api/v1/users/stats/active-admins-today', config)

            console.log("📡 Fetching all count...");
            const AdminsArr = await axios.get('/api/v1/users/Admins', config)
            console.log("📡 afet all admins count...");

            console.log("adminsRes", adminsRes);
            setAdmins(AdminsArr?.data.data || [])
            setAdminsCount(adminsRes?.data.count || 0)
            setactiveAdminsCount(activeAdminsRes?.data.count || 0)
            console.log("after");

        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to load Admin Management info");
        } finally {
            console.log("final");

            setLoading(false);
        }
    }

    const fetchUserManagement = async (role) => {
        console.log(role);
        console.log("start");
        if (!token) {
            console.warn("⚠️ No token available for Admin Management fetch");
            return;
        }
        console.log(token);
        setLoading(true);
        setError(null);
        const st = (!role || role == "all") ? "" : status;

        try {
            // Set up axios config with token
            console.log("try");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("fetching");
            const response = await axios.get(`/api/v1/users/users?page=1&limit=20&role=${st}`, config)
            const Request = await axios.get('/api/v1/Requests/', config)

            console.log("All Users", response.data.data);
            setUsers(response?.data.data);

            console.log("Req", Request.data.data);
            setReqUsers(Request?.data.data);
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to load User Management info");
        } finally {
            console.log("final");
            setLoading(false);
        }
    }

    const fetchMedication = async (param) => {
        const { pages = 1, lim } = param;
        const page = pages ? pages : 1;
        const limit = lim ? lim : 50
        console.log("start");
        if (!token) {
            console.warn("⚠️ No token available for Admin Medication fetch");
            return;
        }
        console.log(token);
        setLoading(true);
        setError(null);

        try {
            console.log("try");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            console.log("📡 Fetching Medication count...");
            const Medi = await axios.get(`/api/v1/medications?page=${page}&limit=${limit}`, config)
            setAdminMedications(Medi.data.data)
            console.log('Done Here', Medi.data.data);
            const remedications_count = await axios.get(`/api/v1/medications/medications-count `, config)
            const remedications_stock = await axios.get(`/api/v1/medications/medications-stock `, config)
            const remedication_companies = await axios.get(`/api/v1/medications/medication-companies `, config)

            console.log("remedication_companies", remedication_companies);
            setmedications_count(Number(remedications_count.count) || 0)
            setmedications_stock(Number(remedications_stock.count) || 0)
            setmedication_companies(Number(remedication_companies.count) || 0)

        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to load Admin Management info");
            setLoading(false);
        } finally {
            console.log("final");
            setLoading(false);
        }
    }


    const UpdateMedication = async (medicationData) => {
        if (!token) {
            setError("No authentication token");
            return { success: false };
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("start");
            const response = await axios.patch(`/api/v1/medications/${medicationData.medicine_id}`, medicationData, config);
            console.log("end");

            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to Update medication';
            setError(errorMsg);
            console.error("❌ Update Medication Error:", errorMsg);
            return { success: false, error: errorMsg };
        }
    }

    const DeleteMedication = async (medicationId) => {
        if (!token) {
            setError("No authentication token");
            return { success: false };
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("start");
            const response = await axios.delete(`/api/v1/medications/${medicationId}`, config);
            console.log("end");

            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to delete medication';
            setError(errorMsg);
            console.error("❌ delete Medication Error:", errorMsg);
            return { success: false, error: errorMsg };
        }
    }

    const AddNewMedication = async (medicationData) => {
        if (!token) {
            setError("No authentication token");
            return { success: false };
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post('/api/v1/medications', medicationData, config);

            // await fetchDashboard();

            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to add medication';
            setError(errorMsg);
            console.error("❌ Add Medication Error:", errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const AddNewLabTest = async (testData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post('/api/v1/lab-examinations', testData, config);

            await fetchDashboard();

            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to add lab test';
            setError(errorMsg);
            console.error("❌ Add Lab Test Error:", errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const AddNewAdmin = async (adminData) => {
        try {
            const formData = new FormData();
            formData.append('name', adminData.name);
            formData.append('email', adminData.email);
            formData.append('phone', adminData.phone);
            formData.append('newAccountPassword', adminData.newAdminPassword);
            formData.append('password', adminData.password);
            // formData.append('national_id', adminData.national_id);
            formData.append('gender', adminData.gender);
            formData.append('birth_date', adminData.BDate);
            formData.append('role', 'admin');
            if (adminData.image) {
                formData.append('photo', adminData.image);
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axios.post('/api/v1/users/Signup/Admin', formData, config);

            // await fetchDashboard();

            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to add admin';
            setError(errorMsg);
            console.error("❌ Add Admin Error:", errorMsg);
            return { success: false, error: errorMsg };
        }
    };



    // Labs
    const UpdateExam = async (Data) => {
        if (!token) {
            setError("No authentication token");
            return { success: false };
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("start");
            const response = await axios.patch(`/api/v1/lab-examinations/${Data.test_id}`, Data, config);
            console.log("end");

            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to Update Lab Exam';
            setError(errorMsg);
            console.error("❌ Update Lab Exam Error:", errorMsg);
            return { success: false, error: errorMsg };
        }
    }

    const DeleteExam = async (Id) => {
        if (!token) {
            setError("No authentication token");
            return { success: false };
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("start");
            const response = await axios.delete(`/api/v1/lab-examinations/${Id}`, config);
            console.log("end");

            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to delete lab-examinations';
            setError(errorMsg);
            console.error("❌ delete lab-examinations Error:", errorMsg);
            return { success: false, error: errorMsg };
        }
    }

    const fetchLab = async (param) => {
        const { pages = 1, lim = 50 } = param;
        const page = pages ? pages : 1;
        const limit = lim ? lim : 50
        console.log("start");
        if (!token) {
            console.warn("⚠️ No token available for Admin Medication fetch");
            return;
        }
        console.log(token);
        setLoading(true);
        setError(null);

        try {
            console.log("try");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            console.log("📡 Fetching lab-examinations...");
            const Medi = await axios.get(`/api/v1/lab-examinations?page=${page}&limit=${limit}`, config)
            setAdminLab(Medi.data.data)
            console.log('Done Here', Medi.data.data);
        } catch (err) {
            console.error("❌ Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to load lab-examinations");
            setLoading(false);
        } finally {
            console.log("final");
            setLoading(false);
        }
    }

    // AdminContext.jsx

    // 1. Add new state variables
    const [reportsData, setReportsData] = useState({
        appointments: 0,
        appointmentChange: "+0%",
        newPatients: 0,
        patientChange: "+0%",
        revenue: 0,
        revenueChange: "+0%",
        prescriptions: 0,
        prescriptionChange: "+0%",
        monthlyTrends: [],
        revenueTrends: [],
    });

    const fetchReports = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [
                apptsRes,
                patientsRes,
                revenueRes,
                prescriptionsRes,
                monthlyRevenueRes, // assuming same endpoint as revenue, or separate if different
            ] = await Promise.all([
                axios.get('/api/v1/users/stats/appointments', config),
                axios.get('/api/v1/users/stats/patients-count', config),
                axios.get('/api/v1/users/stats/appointments-revenue', config),
                axios.get('/api/v1/users/stats/prescriptions', config),
                axios.get('/api/v1/users/stats/appointments-revenue', config), // adjust if you have a monthly-specific endpoint
            ]);

            // From your actual response:
            // apptsRes.data → { status: "success", totalAppointments: 18, monthly: [{month: '12', count: '18'}] }

            setReportsData({
                // Total Appointments this month
                appointments: apptsRes.data.totalAppointments || 0,

                // You can calculate change % if you have previous month data, otherwise mock or leave empty
                appointmentChange: "+15%", // or compute from monthly data if available

                // New patients count
                newPatients: patientsRes.data.count || 0,
                patientChange: "+12%", // mock or compute

                // Revenue
                revenue: revenueRes.data?.data?.totalRevenue || revenueRes.data.totalRevenue || 0,
                revenueChange: "+24%",

                // Prescriptions
                prescriptions: prescriptionsRes.data.count || 0,
                prescriptionChange: "+8%",

                // Monthly trends for appointments (from your response: monthly array)
                monthlyTrends: apptsRes.data.monthly || [],
                // Example format: [{ month: '12', count: '18' }]

                // Monthly revenue trends
                revenueTrends: monthlyRevenueRes.data?.data || [],
                // Adjust based on actual structure — likely same as revenueRes.data.data
            });

            // Keep your logs for debugging
            console.log("Appointments Response:", apptsRes.data);
            console.log("Patients Response:", patientsRes.data);
            console.log("Revenue Response:", revenueRes.data);
            console.log("Prescriptions Response:", prescriptionsRes.data);
            console.log("Monthly Revenue Response:", monthlyRevenueRes.data);

        } catch (err) {
            console.error("❌ Reports Fetch Error:", err);
            setError(err.response?.data?.message || "Failed to load reports");
        } finally {
            setLoading(false);
        }
    };
    // 2. Export fetchReports and reportsData in Provider value



    return (
        <AdminContext.Provider
            value={{
                // DashBoard
                fetchDashboard,
                AddNewMedication,
                AddNewLabTest,
                AddNewAdmin,
                TotalUsers,
                ActiveDoctors,
                Patients,
                Medications,
                loading,
                error,

                // Admin Management
                Admins,
                AdminsCount,
                activeAdminsCount,
                fetchAdminManagement,

                //User Management
                fetchUserManagement,
                Users,
                reqsUsers,

                //Admin Medications
                fetchMedication,
                AdminMedications,
                UpdateMedication,
                DeleteMedication,
                medications_count,
                medications_stock,
                medication_companies,


                //Lab Exam
                fetchLab,
                UpdateExam,
                DeleteExam,
                AdminLab,
                fetchReports, reportsData,



            }}
        >
            {children}
        </AdminContext.Provider>
    );
}