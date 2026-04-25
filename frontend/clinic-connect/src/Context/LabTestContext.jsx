import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProviderContext";

export const LabTestContext = createContext();

export function LabTestProvider({ children }) {
    const { token, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [patientLabTests, setPatientLabTests] = useState([]);

    const fetchPatientLabTests = async (
        page = 1,
        limit = 20,
        status = null,
        search = ''
    ) => {
        if (!token || !user) {
            console.log(' No token or user');
            return;
        }

        console.log('Fetching Lab Tests:', { page, limit, status, search });
        setLoading(true);
        setError(null);
        const st = (!status || status == "all") ? "" : status;

        try {
            const response = await axios.get(`/api/v1/labtests/labtests?page=${Number(
                page
            )}&limit=${Number(limit)}&status=${st}&search=`, {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Lab Tests:', response.data.data);
            // console.log(user);

            setPatientLabTests(response.data.data || []);
            // console.log(patientLabTests);

        } catch (err) {
            console.error('Error fetching Pateint Lab Tests:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to fetch Pateint Lab Tests');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <LabTestContext.Provider
            value={{
                fetchPatientLabTests,
                patientLabTests,
                loading,
                error

            }}
        >
            {children}
        </LabTestContext.Provider>
    )
}