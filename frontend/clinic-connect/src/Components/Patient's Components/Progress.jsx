import { Box, CircularProgress } from "@mui/material";

export default function Progress() {
  return (
    <div className="!h-full  " sx={{ display: "flex" }}>
      <CircularProgress className="m-auto" />
    </div>
  );
}
