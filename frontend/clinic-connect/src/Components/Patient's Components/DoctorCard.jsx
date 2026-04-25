import { Star, Schedule, LocationOn, CalendarToday } from "@mui/icons-material";
import { Card, CardContent, Button, Chip } from "@mui/material";
// import { Card, CardContent, Button, Chip } from "@mui/material";
import styles from "../../Style/Patient's Style/DoctorCard.module.css";
import { useNavigate } from "react-router-dom";

export function DoctorCard({ doctor, HandleClickMessage }) {
  const navigate = useNavigate();
  return (
    <Card className={styles.doctorCard} style={{ border: "none" }}>
      <CardContent className={styles.cardContent}>
        <div className={styles.cardBody}>
          {/* Avatar */}
          <div className={styles.avatarContainer}>
            <img src={doctor.img} alt={doctor.name} className={styles.avatar} />
          </div>

          {/* Info */}
          <div className={styles.infoContainer}>
            <div className={styles.headerRow}>
              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.specialty}>{doctor.specialization}</p>
              </div>
            </div>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <Star className={styles.starIcon} />
              <span className={styles.rating}>{doctor.rating}</span>
              <span className={styles.reviewCount}>
                ({doctor.reviewCount} reviews)
              </span>
            </div>

            {/* Details */}
            <div className={styles.detailsRow}>
              {doctor.years_of_experience && (
                <div className={styles.detailItem}>
                  <Schedule className={styles.detailIcon} />
                  <span>{doctor.years_of_experience} yrs</span>
                </div>
              )}
              {doctor.location && (
                <div className={styles.detailItem}>
                  <LocationOn className={styles.detailIcon} />
                  <span>{doctor.location}</span>
                </div>
              )}
            </div>

            {/* Next Available */}
            {/* {doctor.nextAvailable && ( */}
            <div className={styles.nextAvailable}>
              <CalendarToday className={styles.calendarIcon} />
              <span className={styles.nextLabel}>Next available: </span>
              <span className={styles.nextDate}>
                {doctor.nextAvailable || "Open Now"}
              </span>
            </div>
            {/* )} */}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsRow}>
          <Button
            variant="outlined"
            className={styles.outlineButton}
            onClick={() => navigate(`/doctor/${doctor.national_id}`)}
            style={{
              fontFamily: "Alan Sans, sans-serif",
              color: "#5A78C9",
              borderColor: "#5A78C9",
            }}
          >
            View Profile
          </Button>
          <Button
            variant="contained"
            className={styles.primaryButton}
            onClick={() => {
              HandleClickMessage(doctor.national_id);
            }}
            style={{
              fontFamily: "Alan Sans, sans-serif",
              backgroundColor: "#5A78C9",
            }}
          >
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
