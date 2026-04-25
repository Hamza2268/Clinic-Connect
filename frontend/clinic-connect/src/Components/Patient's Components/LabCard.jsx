import { useState } from "react";
import styles from "../../Style/Patient's Style/DoctorCard.module.css";
import { Star, Schedule, LocationOn, CalendarToday } from "@mui/icons-material";
import { Card, CardContent, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export function LabCard({ lab, HandleClickMessage }) {
  // const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className={styles.doctorCard}>
      <CardContent className={styles.cardContent}>
        <div className={styles.cardBody}>
          {/* Avatar */}
          <div className={styles.avatarContainer}>
            <img src={lab.img} alt={lab.name} className={styles.avatar} />
          </div>

          {/* Info */}
          <div className={styles.infoContainer}>
            <div className={styles.headerRow}>
              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>{lab.lab_name}</h3>
                <div className={styles.PharmacyOwner}>
                  <PersonOutlineIcon />
                  <span>{lab.name}</span>
                </div>
                {/* <p className={styles.specialty}>{lab.specialty}</p> */}
              </div>
              <Chip
                label={"Available"}
                // className={lab.available ? styles.availableChip : styles.busyChip}
                className={styles.availableChip}
                size="small"
                style={{
                  color: "white",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  backgroundColor: "#76BFBB",
                }}
              />
            </div>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <Star className={styles.starIcon} />
              <span className={styles.rating}>{lab.rating}</span>
            </div>

            {/* Details */}
            <div className={styles.detailsRow}>
              <div className={styles.detailItem}>
                <Schedule className={styles.detailIcon} />
                <span>{lab.opening_time}</span>
              </div>
              <br />
              <div className={styles.detailItem}>
                <LocationOn className={styles.detailIcon} />
                <span>{lab.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsRow}>
          <Button
            variant="outlined"
            className={styles.outlineButton}
            style={{
              fontFamily: "Alan Sans, sans-serif",
              color: "#5A78C9",
              borderColor: "#5A78C9",
            }}
            onClick={() => navigate(`/Lab/${lab.national_id}`)}
            // onClick={() => console.log(lab)}
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
              HandleClickMessage(lab.id);
            }}
          >
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
