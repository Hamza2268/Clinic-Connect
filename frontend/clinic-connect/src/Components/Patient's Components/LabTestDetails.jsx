import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Badge,
  Button,
} from "@mui/material";
import {
  FlaskConical,
  Calendar,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";

export default function LabTestDetails({
  test,
  getStatusBadge,
  getResultBadge,
}) {
  return (
    <Card
      key={test.labtechnician_id}
      className="bg-card border-border !rounded-4xl"
    >
      <CardHeader
        className="pb-2 px-4"
        title={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A78C9] flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography
                  className="!text-2xl"
                  style={{ fontFamily: "alan sans" }}
                >
                  {test.test_name}
                </Typography>
                {/* <p className="text-sm text-muted-foreground">{test.category}</p> */}
              </div>
            </div>
            {getStatusBadge(test.status)}
          </div>
        }
      />

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4  text-center">
          {test.doctor_name && (
            <div className="flex items-center gap-2 text-base mx-auto">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Ordered by:</span>
              <span className="text-foreground font-medium">
                {test.doctor_name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-base mx-auto">
            <Calendar className="w-4 h-4 text-muted-foreground " />
            <span className="text-muted-foreground">Scheduled on:</span>
            <span className="text-foreground">{test.date.split("T")[0]}</span>
          </div>
          {test.resultDate && (
            <div className="flex items-center gap-2 text-sm mx-auto">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Result:</span>
              <span className="text-foreground">
                {test.pickup_date.split("T")[0]}
              </span>
            </div>
          )}
        </div>

        {/* Results Table */}
        {test.result && (
          <div className="bg-muted/30 rounded-lg overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-foreground">
                    Test
                  </th>
                  <th className="text-left p-3 font-medium text-foreground">
                    Result
                  </th>
                  <th className="text-left p-3 font-medium text-foreground">
                    Reference Range
                  </th>
                  <th className="text-left p-3 font-medium text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {test.results.map((result, index) => ( */}
                <tr key={test.test_id} className="border-t border-border">
                  <td className="p-3 text-foreground">{test.test_name}</td>
                  <td className="p-3 text-foreground font-medium">
                    {test.result}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {JSON.parse(test.reference_range)[0]} -{" "}
                    {JSON.parse(test.reference_range)[1]}
                  </td>
                  <td className="p-3">
                    {JSON.parse(test.reference_range)[1] < test.result
                      ? getResultBadge("high")
                      : JSON.parse(test.reference_range)[0] > test.result
                        ? getResultBadge("low")
                        : test.result
                          ? getResultBadge("normal")
                          : getResultBadge(null)}
                  </td>
                </tr>
                {/* ))} */}
              </tbody>
            </table>
          </div>
        )}

        {/* Status Message for Pending/In-Progress */}
        {!test.result && (
          <div className="bg-muted/30 rounded-lg p-4  flex items-center justify-start gap-3">
            {test.status === "assigned" ? (
              <div className="">
                <Clock
                  className="w-6 h-6 text-green-500 mr-2 "
                  style={{ display: "inline-block" }}
                />
                <p
                  className="text-base text-muted-foreground"
                  style={{ display: "inline-block" }}
                >
                  Your test is currently being processed. Results will be
                  available soon.
                </p>
              </div>
            ) : (
              <div className="">
                <AlertCircle
                  className="w-6 h-6 text-muted-foreground mr-2"
                  style={{ display: "inline-block" }}
                />
                <p
                  className="text-base  text-muted-foreground m-0 p-0"
                  style={{ display: "inline-block" }}
                >
                  This test is scheduled. Please visit the lab for your sample
                  collection.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
