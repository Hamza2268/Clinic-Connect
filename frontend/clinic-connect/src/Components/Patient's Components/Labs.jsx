import { useEffect, useContext, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { LabCard } from "./LabCard";
import Progress from "./Progress";
import Error from "./Error";
import HomeStyle from "../../Style/Home.module.css";
import { ServicesContext } from "../../Context/ServicesContext";
import { Users } from "lucide-react";

export const Labs = () => {
    const { labs, fetchLabs, loading, error } = useContext(ServicesContext);
    const { searchQuery, HandleClickMessage } = useOutletContext();

    useEffect(() => {
        fetchLabs();
    }, []);

    const filteredLabs = useMemo(() => {
        if (!labs) return [];
        return labs.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [labs, searchQuery]);

    if (loading) return <Progress />;
    if (error) return <Error />;
    if (filteredLabs.length === 0)
        return <div className={HomeStyle.emptyState}>
            <div className={HomeStyle.emptyIcon}>
                <Users className={HomeStyle.emptyIconSvg} />
            </div>
            <h3 className={HomeStyle.emptyTitle}>No Labs found</h3>
            <p className={HomeStyle.emptyText}>
                Try adjusting your search or filter criteria
            </p>
        </div>;

    return (
        <div className={HomeStyle.doctorsGrid}>
            {filteredLabs.map((lab, index) => (
                <div key={lab.id} className={HomeStyle.doctorCardWrapper} style={{ animationDelay: `${index * 50}ms` }}>
                    <LabCard HandleClickMessage={HandleClickMessage} lab={lab} />
                </div>
            ))}
        </div>
    );
};