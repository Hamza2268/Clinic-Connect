import { Card, CardContent } from "@mui/material";
import { Clock, FileText } from "lucide-react";

export default function PrescriptionSummary({
  totalPrescriptionsCount,
  expiredPrescriptionsCount,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-foreground">
                {totalPrescriptionsCount}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Prescriptions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
        {/* <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-2">
                                <Pill className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{totalMedications}</p>
                            <p className="text-xs text-muted-foreground">Total Medications</p>
                        </CardContent>
                    </Card> */}
        {/* <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-warning/20 flex items-center justify-center mb-2">
                                <RefreshCw className="w-5 h-5 text-warning" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">
                                {prescriptions.filter((p) => p.status === "refill-needed").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Need Refill</p>
                        </CardContent>
                    </Card> */}

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-foreground">
                {expiredPrescriptionsCount}
              </p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
