import styles from "../../Style/Patient's Style/SpecialtyFilter.module.css";

export function SpecialtyFilter({ specialties, selected, onSelect }) {
    return (
        <div className={styles.filterContainer}>
            <button
                onClick={() => onSelect("All")}
                className={`${styles.filterButton} ${selected === "All" ? styles.filterButtonActive : ""
                    }`}
            >
                All Doctors
            </button>
            {specialties.map((specialty) => (
                <button
                    key={specialty}
                    onClick={() => onSelect(specialty)}
                    className={`${styles.filterButton} ${selected === specialty ? styles.filterButtonActive : ""
                        }`}
                >
                    {specialty}
                </button>
            ))}
        </div>
    );
}