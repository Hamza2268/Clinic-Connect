import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { LocalHospital, LocalPharmacy, Science } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const userTypes = [
  { value: "doctors", label: "Doctors", icon: LocalHospital },
  { value: "pharmacies", label: "Pharmacies", icon: LocalPharmacy },
  { value: "labs", label: "Labs", icon: Science },
];

export function UserTypeFilter({ selected, onSelect }) {
  const navigate = useNavigate();
  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      onChange={(e, value) => value && onSelect(value)}
      aria-label="user type filter"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 2,
        "& .MuiToggleButton-root": {
          borderRadius: "12px !important",
          border: "1px solid rgba(0, 0, 0, 0.12) !important",
          background: "rgba(255, 255, 255, 0.8)",
          px: 4,
          py: 1.5,
          minHeight: 44,
          fontSize: "16px",
          textTransform: "none",
          fontWeight: 540,
          display: "flex",
          gap: 1,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
          "&.Mui-selected": {
            background: "#5A78C9",
            color: "white",
            borderColor: "transparent !important",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          },
        },
      }}
    >
      {userTypes.map(({ value, label, icon: Icon }) => (
        <ToggleButton
          key={value}
          value={value}
          onClick={() => navigate(`/services/${value}`)}
        >
          <Icon fontSize="medium" />
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
