import {
  Calendar,
  Clock,
  DollarSign,
  User,
  FileText,
  FlaskConical,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Badge } from "@mui/material";

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    className:
      "inline-flex items-center rounded-md bg-[#5A78C9]/10 px-3 py-2 text-sm font-medium text-[#5A78C9] inset-ring inset-ring-[#5A78C9]/20",
  },
  completed: {
    label: "Completed",
    className:
      "inline-flex items-center rounded-md bg-[#63a89e]/10 px-3 py-2 text-sm font-medium text-[#63a89e] inset-ring inset-ring-[#63a89e]/20",
  },
  missed: {
    label: "Missed",
    className:
      "inline-flex items-center rounded-md bg-red-400/10 px-3 py-2 text-sm font-medium text-red-400 inset-ring inset-ring-red-400/20",
  },
  inprogress: {
    label: "InProgress",
    className:
      "inline-flex items-center rounded-md bg-yellow-400/10 px-3 py-2 text-sm font-medium text-yellow-400 inset-ring inset-ring-yellow-400/20",
  },
};

export const AppointmentCard = ({ appointment, index }) => {
  const navigate = useNavigate();
  const status = statusConfig[appointment.status];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (appointment)
    return (
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in border-border/50"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Status indicator bar */}
            <div
              className={`w-full sm:w-1.5 h-1.5 sm:h-auto ${
                appointment.status === "upcoming"
                  ? "bg-[#5A78C9]"
                  : appointment.status === "completed"
                    ? "bg-[#63a89e]"
                    : "bg-red-700"
              }`}
            />

            <div className="flex-1 p-3 sm:p-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                {/* Doctor info */}
                <div
                  className="flex items-start gap-3"
                  onClick={() => navigate(`/doctor/${appointment.doctorid}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    {<img className="rounded-full" src={appointment.img} /> || (
                      <User className="w-5 h-5 text-secondary-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Dr.{appointment.doctorname}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {appointment.specialization}
                    </p>
                  </div>
                </div>

                {/* Status badge */}
                <Badge
                  variant="outline"
                  className={`${status.className} self-start`}
                >
                  {status.label}
                </Badge>
              </div>

              {/* Appointment details */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground text-base font-medium">
                    {formatDate(appointment.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground text-base font-medium">
                    {formatTime(appointment.start_hour)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground text-base font-semibold">
                    {appointment.fees}
                  </span>
                </div>
              </div>

              {/* Symptoms section */}
              {appointment.symptoms && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Symptoms
                      </p>
                      <p className="text-foreground text-base">
                        {appointment.symptoms}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons for completed appointments
              {appointment.status === "completed" && (
                <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-2">
                  {appointment.prescriptionId && (
                    <button
                      className="!rounded-3xl hover:-translate-y-2 smooth inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-sky-700 bg-white border border-sky-700 rounded-lg hover:bg-sky-50 active:bg-sky-100 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => navigate(`/prescriptions`)}
                    >
                      <FileText className="w-4 h-4" />
                      View Prescription
                    </button>
                  )}
                  {appointment.labTestIds &&
                    appointment.labTestIds.length > 0 && (
                      <button
                        className="!rounded-3xl hover:-translate-y-2 smooth inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-white border border-green-700 rounded-lg hover:bg-green-50 active:bg-green-100 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => navigate(`/LabTests`)}
                      >
                        <FlaskConical className="w-4 h-4 text-green-500" />
                        View Lab Test
                      </button>
                    )}
                </div>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    );
};
