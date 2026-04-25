import { Card, CardContent } from "@mui/material";
// import { Download, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { CalendarDays, FileText, Clock } from "lucide-react";

export default function LabTestDetails({
  completedTestsCount,
  inProgressTestsCount,
  pendingTestsCount,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Lab Tests & Results
          </h1>
          <p className="text-muted-foreground mt-1">
            View your lab test history and results
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-18 mt-6">
        <div className="flex items-center gap-3 bg-white pl-[20px] mx-10 py-2 rounded-lg">
          <div className="bg-blue-100 p-2 rounded-lg">
            <CalendarDays className="w-6 h-6 text-[#5A78C9]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-0">
              {inProgressTestsCount}
            </div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white pl-[20px] mx-10  py-2 rounded-lg">
          <div className="bg-green-100 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground mb-0">
              {completedTestsCount}
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white pl-[20px] mx-10  py-2 rounded-lg">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground mb-0">
              {pendingTestsCount}
            </p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>
    </>
  );
}
