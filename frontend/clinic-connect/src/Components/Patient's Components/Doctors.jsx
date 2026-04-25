import { useEffect, useContext, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { DoctorCard } from "./DoctorCard";
import Progress from "./Progress";
import Error from "./Error";
import HomeStyle from "../../Style/Home.module.css";
import { ServicesContext } from "../../Context/ServicesContext";
import { Users } from "lucide-react";

export const Doctors = () => {
    const { doctors, fetchDoctors, loading, error } = useContext(ServicesContext);

    const { searchQuery, selectedSpecialty, HandleClickMessage } = useOutletContext();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const filteredDoctors = useMemo(() => {
        if (!doctors) return [];
        return doctors.filter(doc => {
            const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
            return matchSearch && matchSpecialty;
        });
    }, [doctors, searchQuery, selectedSpecialty]);

    if (loading) return <Progress />;
    if (error) return <Error />;
    if (filteredDoctors.length === 0)
        return <div className={HomeStyle.emptyState}>
            <div className={HomeStyle.emptyIcon}>
                <Users className={HomeStyle.emptyIconSvg} />
            </div>
            <h3 className={HomeStyle.emptyTitle}>No Doctors found</h3>
            <p className={HomeStyle.emptyText}>
                Try adjusting your search or filter criteria
            </p>
        </div>;

    return (
        <div className={HomeStyle.doctorsGrid}>
            {filteredDoctors.map((doctor, index) => (
                <div key={doctor.id} className={HomeStyle.doctorCardWrapper} style={{ animationDelay: `${index * 50}ms` }}>
                    <DoctorCard HandleClickMessage={HandleClickMessage} doctor={doctor} />
                </div>
            ))}
        </div>
    );
};


// const EmptyState = ({ type }) => (
//     <div className={HomeStyle.emptyState}>
//         <div className={HomeStyle.emptyIcon}> <Users className={HomeStyle.emptyIconSvg} /> </div>
//         <h3 className={HomeStyle.emptyTitle}>No {type} found</h3>
//     </div>
// );