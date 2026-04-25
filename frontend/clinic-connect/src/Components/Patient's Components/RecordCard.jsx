import { useState } from "react";
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Collapse,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  CalendarMonth,
  Person,
  LocalHospital,
  Science,
  Medication,
  Assignment,
  Notes,
} from "@mui/icons-material";
import MainLayout from "../MainLayout";

const statusColors = {
  completed: "success",
  ongoing: "warning",
  "in-progress": "info",
};

export function RecordCard({ record }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card
      className="bg-card border border-border rounded-2xl !rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300"
      sx={{ mb: 3 }}
    >
      <CardContent className="p-0">
        {/* Header */}
        <Box
          className="px-5 py-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <Box className="flex items-start justify-between">
            <Box className="flex-1">
              <Box className="flex items-center gap-2 mb-3">
                <CalendarMonth className="text-[#5A78C9]" />
                <div className="text-lg text-muted-foreground">
                  {record.created_at.split("T")[0]}
                </div>
              </Box>
              <div className="font-heading font-semibold text-base text-foreground">
                Diagnosed with : {record.diagnose}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Person fontSize="small" className="text-muted-foreground" />
                <div className="text-base text-muted-foreground">
                  Dr.{record.name} • {record.specialization}
                </div>
              </div>
            </Box>
            <Box className="flex items-center gap-1">
              <IconButton size="small">
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Divider />
          <Box className="px-5 py-4 space-y-4">
            {/* Medications */}
            <Box>
              <Box className="flex items-center gap-2 mb-3">
                <Medication className="text-[#5A78C9]" />
                <div className="font-semibold text-lg text-foreground">
                  Treatment Plan
                </div>
              </Box>
              <Box className="space-y-3">
                <Box className="bg-secondary/50 rounded-xl ">
                  <div className="text-base  text-foreground">
                    {record.treatment_plan}
                  </div>
                </Box>
              </Box>
            </Box>

            {/* Lab Tests */}
            {/* <Box>
                            <Box className="flex items-center gap-2 mb-2">
                                <Science className="text-primary" fontSize="small" />
                                <Typography className="font-semibold text-foreground">
                                    Lab Tests & Results
                                </Typography>
                            </Box>
                            <Box className="space-y-2">
                                {record.labTests.map((test, index) => (
                                    <Box
                                        key={index}
                                        className="flex items-center justify-between bg-secondary/50 rounded-xl p-3"
                                    >
                                        <Box>
                                            <Typography className="font-medium text-foreground">
                                                {test.name}
                                            </Typography>
                                            <Typography className="text-sm text-muted-foreground">
                                                {new Date(test.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={test.result}
                                            size="small"
                                            className="bg-accent text-accent-foreground"
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box> */}

            {/* Recovery Plan */}
            {/* <Box>
                            <Box className="flex items-center gap-2 mb-2">
                                <Assignment className="text-primary" fontSize="small" />
                                <Typography className="font-semibold text-foreground">
                                    Recovery Plan
                                </Typography>
                            </Box>
                            <Box className="bg-primary/10 rounded-xl p-4">
                                <Typography className="text-foreground">
                                    {record.treatment_plan}
                                </Typography>
                            </Box>
                        </Box> */}

            {/* Notes */}
            {record.notes && (
              <Box>
                <Box className="flex items-center gap-2 mb-3">
                  <Notes className="text-primary" fontSize="small" />
                  <Typography className="font-semibold text-sm text-foreground">
                    Doctor's Notes
                  </Typography>
                </Box>
                <Typography className="text-sm text-muted-foreground italic">
                  "{record.notes}"
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
