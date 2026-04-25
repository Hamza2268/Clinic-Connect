import { Star, Schedule, LocationOn, CalendarToday } from "@mui/icons-material";
import { Card, CardContent, Button, Chip } from "@mui/material";
// import { Card, CardContent, Button, Chip } from "@mui/material";
import styles from "../../Style/Patient's Style/DoctorCard.module.css";
import { useNavigate } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
export function PharmacyCard({ Pharmacy, HandleClickMessage }) {
  const navigate = useNavigate();
  return (
    <Card className={styles.doctorCard}>
      <CardContent className={styles.cardContent}>
        <div className={styles.cardBody}>
          {/* Avatar */}
          <div className={styles.avatarContainer}>
            <img
              src={Pharmacy.img}
              alt={Pharmacy.pharmacy_name}
              className={styles.avatar}
            />
          </div>

          {/* Info */}
          <div className={styles.infoContainer}>
            <div className={styles.headerRow}>
              <div className={styles.PharmacyInfo}>
                <h3 className={styles.doctorName}>{Pharmacy.pharmacy_name}</h3>
                <div className={styles.PharmacyOwner}>
                  <PersonOutlineIcon />
                  <span>{Pharmacy.name}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <Star className={styles.starIcon} />
              <span className={styles.rating}>{Pharmacy.rating}</span>
            </div>

            {/* Details */}
            <div className={styles.detailsRow}>
              <div className={`${styles.detailItem} pb-2`}>
                <LocationOn className={styles.detailIcon} />
                <span>{Pharmacy.address}</span>
              </div>
            </div>

            {/* Next Available */}
            {Pharmacy.nextAvailable && (
              <div className={styles.nextAvailable}>
                <CalendarToday className={styles.calendarIcon} />
                <span className={styles.nextLabel}>Next available: </span>
                <span className={styles.nextDate}>
                  {Pharmacy.nextAvailable}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsRow}>
          <Button
            variant="outlined"
            className={`${styles.outlineButton} hover:-translate-y-1`}
            style={{
              fontFamily: "Alan Sans, sans-serif",
              color: "#5A78C9",
              borderColor: "#5A78C9",
            }}
            onClick={() => navigate(`/Pharmacy/${Pharmacy.national_id}`)}
          >
            View Profile
          </Button>
          <Button
            variant="contained"
            className={styles.primaryButton}
            style={{
              fontFamily: "Alan Sans, sans-serif",
              backgroundColor: "#5A78C9",
            }}
            onClick={() => {
              HandleClickMessage(Pharmacy.national_id);
            }}
          >
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
