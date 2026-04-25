import { createContext, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";
import { toast } from "sonner";

export const LabContext = createContext();

export function LabProvider({ children }) {
  const [labtests, setLabtest] = useState(null);
  const [patientTest, setPatientTest] = useState(null);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [patientInfo, setPatientInfo] = useState(null);
  const [patientInfoLabRequests, setPatientInfoLabRequests] = useState(null);

  const [labTechnician, setLabTechnician] = useState(null);
  const [labTechnicianError, setLabTechnicianError] = useState(null);

  const { token } = useContext(AuthContext);

  const fetchLabTechnician = async (labTechnicianId) => {
    if (!token || !labTechnicianId) return;
    setLoading(true);
    setLabTechnicianError(null);
    try {
      const response = await axios.get(
        `/api/v1/users/labtechnicians/${labTechnicianId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(response.data.data);
      setLabTechnician(response.data.data);
    } catch (err) {
      console.error(err);
      setLabTechnicianError(
        err.response?.data?.message || "Failed to load lab technician",
      );
    } finally {
      setLoading(false);
    }
  };

  const GetAllLabTest = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/lab-examinations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLabtest(response.data.data);
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed to get lab tests");
    } finally {
      setLoading(false);
    }
  };

  const addLabTest = async (labdata) => {
    try {
      await axios.post("/api/v1/lab-examinations", labdata);
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed to add lab tests");
    } finally {
      setLoading(false);
    }
  };

  const getLabExamination = async (searchValue) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/lab-examinations/Examination/?search=${searchValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLabtest(response.data.data);
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "failed to get lab tests");
    } finally {
      setLoading(false);
    }
  };

  const createLabRequest = async (test_id, patient_id) => {
    try {
      await axios.post(`/api/v1/labtests/labtests/${patient_id}`, test_id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true };
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "failed to request lab tests",
      );
    } finally {
      setLoading(false);
    }
  };

  const getPatientLabTests = async (patientID) => {
    if (!token) return;
    console.log("provider getPatientLabTests:", patientID);
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/users/patients/${patientID}/lab-tests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      setPatientTest(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch patient lab tests",
      );
    } finally {
      setLoading(false);
    }
  };

  const getLabTechLabRequests = async (page, limit, status) => {
    if (!token) return;
    console.log("provider getLabTechLabRequests:");
    setLoading(true);
    const st = !status || status == "all" ? "" : status;
    try {
      const response = await axios.get(
        `/api/v1/labtests/labtests/?page=${page}&limit=${limit}&status=${st}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      setLabtest(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to fetch lab technician requests",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateLabTestStatus = async (labtestId, newStatus) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/v1/labtests/${labtestId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Updated Lab Test:", response.data);
      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.response?.data?.message || "Failed to update Lab Test status",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadLabTestResult = async (labtestId, result) => {
    if (!token) return;
    setLoading(true);
    try {
      console.log(labtestId, result);
      const response = await axios.post(
        `/api/v1/labresults/${labtestId}/result`,
        { result: result },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Uploaded Lab Test Result:", response.data);
      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.response?.data?.message || "Failed to upload Lab Test result",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLabTechPatients = async (page, limit, search) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/users/lab-technician/?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Lab Tech Patients:", response.data);

      setPatientTest(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalPatients(response.data.results);
      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.response?.data?.message || "Failed to fetch lab tech patients",
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailableLabTests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/lab-tech-available/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Available Lab Tests:", response.data.data);
      setLabtest(response.data.data);
      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.response?.data?.message || "Failed to fetch available lab tests",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateLabTest = async (labtestId, updateData) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/v1/lab-tech-available/${labtestId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Updated Lab Test:", response.data);
      return response.data;
    } catch (err) {
      console.error(err.message);

      toast.error(err.response?.data?.message || "Failed to update Lab Test");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLabTest = async (labtestId) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.delete(
        `/api/v1/lab-tech-available/${labtestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Deleted Lab Test:", response.data);
      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(err.response?.data?.message || "Failed to delete Lab Test");
      throw err;
    }
  };

  const addLabTestToInventory = async (labid, labtestData) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/v1/lab-tech-available/${labid}`,
        labtestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Added Lab Test to Inventory:", response.data);
      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(err.response?.data?.message || "Failed to add Lab Test");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLabTechPatientInfo = async (patientid) => {
    if (!token) return;
    setLoading(true);
    try {
      console.log("get the lab patient info");
      const response = await axios.get(
        `/api/v1/users/lab-technician/patients/${patientid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Lab Tech Patients infoooooooooooooo:", response.data);

      setPatientInfo(response.data.data.patient);
      setPatientInfoLabRequests(response.data.data.labTests);
      return response.data;
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.response?.data?.message || "Failed to fetch lab tech patients",
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTestsForLabtech = async (labtech_id, search = "") => {
    try {
      const response = await axios.get(
        `/api/v1/lab-tech-available/${labtech_id}?search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "failed to get available tests",
      );
    }
  };

  const getRequiredLabTestsForPatient = async () => {
    try {
      const response = await axios.get(`/api/v1/labtests/required`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "failed to get required lab tests",
      );
    }
  };

  // const updateLabTest = async (labtest_id, status) => {
  //   try {
  //     await axios.patch(
  //       `/api/v1/labtests/labtests/${labtest_id}`,
  //       { status },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     return { success: true };
  //   } catch (err) {
  //     throw new Error(
  //       err.response?.data?.message || "failed to update lab test"
  //     );
  //   }
  // };

  const assignLabTestToTechnician = async (labtest_id, labtechnician_id) => {
    try {
      console.log(labtest_id);
      await axios.patch(
        `/api/v1/labtests/assign/${labtechnician_id}`,
        { labTestId: labtest_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return { success: true };
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "failed to assign lab test",
      );
    }
  };

  return (
    <LabContext.Provider
      value={{
        labtests,
        loading,
        GetAllLabTest,
        addLabTest,
        getLabExamination,
        createLabRequest,

        getPatientLabTests,
        patientTest,
        getLabTechLabRequests,
        totalPages,
        updateLabTestStatus,
        uploadLabTestResult,
        getLabTechPatients,
        getAvailableLabTests,
        updateLabTest,
        deleteLabTest,
        addLabTestToInventory,
        totalPatients,
        getLabTechPatientInfo,
        patientInfo,
        patientInfoLabRequests,

        labTechnician,
        labTechnicianError,
        fetchLabTechnician,
        getAvailableTestsForLabtech,
        getRequiredLabTestsForPatient,

        assignLabTestToTechnician, // 🆕
      }}
    >
      {children}
    </LabContext.Provider>
  );
}
