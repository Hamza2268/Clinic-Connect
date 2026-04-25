import { useEffect, useContext, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { PharmacyCard } from "./PharmacyCard";
import Progress from "./Progress";
import Error from "./Error";
import HomeStyle from "../../Style/Home.module.css";
import { ServicesContext } from "../../Context/ServicesContext";
import { Users } from "lucide-react";

export const Pharmacies = () => {
    const { pharmacies, fetchPharmacies, loading, error } = useContext(ServicesContext);
    const { searchQuery, HandleClickMessage } = useOutletContext();

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const filteredPharmacies = useMemo(() => {
        if (!pharmacies) return [];
        return pharmacies.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [pharmacies, searchQuery]);

    if (loading) return <Progress />;
    if (error) return <Error />;
    if (filteredPharmacies.length === 0)
        return <div className={HomeStyle.emptyState}>
            <div className={HomeStyle.emptyIcon}>
                <Users className={HomeStyle.emptyIconSvg} />
            </div>
            <h3 className={HomeStyle.emptyTitle}>No Pharmacies found</h3>
            <p className={HomeStyle.emptyText}>
                Try adjusting your search or filter criteria
            </p>
        </div>;

    return (
        <div className={HomeStyle.doctorsGrid}>
            {filteredPharmacies.map((pharmacy, index) => (
                <div key={pharmacy.id} className={HomeStyle.doctorCardWrapper} style={{ animationDelay: `${index * 50}ms` }}>
                    <PharmacyCard HandleClickMessage={HandleClickMessage} Pharmacy={pharmacy} />
                </div>
            ))}
        </div>
    );
};