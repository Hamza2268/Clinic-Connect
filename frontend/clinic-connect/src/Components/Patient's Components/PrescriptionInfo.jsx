import { Card, CardContent, Badge, Button } from "@mui/material";
import {
  Pill,
  Calendar,
  User,
  Download,
  RefreshCw,
  Clock,
  FileText,
  Hash,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrescriptionInfo({ prescription, getStatusBadge }) {
  const navigate = useNavigate();
  const notes = prescription.medications.filter((m) => m.note);

  return (
    // <Card className="bg-card border-border overflow-hidden">
    //     {/* Prescription Header */}
    //     <div className="bg-muted/30 px-6 py-4 border-b border-border">
    //         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    //             <div className="flex items-center gap-4">
    //                 <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
    //                     <FileText className="w-6 h-6 text-primary" />
    //                 </div>
    //                 <div>

    //                     <h3 className="font-semibold text-foreground">{prescription.diagnosis}</h3>
    //                 </div>
    //             </div>
    //             <div className="flex items-center gap-3">
    //                 {getStatusBadge(prescription.status)}
    //                 <Badge variant="outline" className="font-mono">
    //                     {prescription.medications.length} {prescription.medications.length === 1 ? 'med' : 'meds'}
    //                 </Badge>
    //             </div>
    //         </div>
    //     </div>

    //     <CardContent className="p-6">
    //         {/* Prescription Info */}
    //         <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-6 pb-4 border-b border-border ">
    //             <div className="flex items-center gap-2 text-sm mx-auto">
    //                 <User className="w-4 h-4 text-primary" />
    //                 <div>
    //                     <p className="text-xs text-muted-foreground">Prescribed by</p>
    //                     <p className="text-foreground font-medium">{prescription.doctor_name}</p>
    //                 </div>
    //             </div>
    //             <div className="flex items-center gap-2 text-sm mx-auto">
    //                 <Calendar className="w-4 h-4 text-primary" />
    //                 <div>
    //                     <p className="text-xs text-muted-foreground">Date</p>
    //                     <p className="text-foreground">{prescription.date.split('T')[0]}</p>
    //                 </div>
    //             </div>
    //             {prescription.expired_date && <div className="flex items-center gap-2 text-sm mx-auto">
    //                 <Clock className="w-4 h-4 text-primary" />
    //                 <div>
    //                     <p className="text-xs text-muted-foreground ">Expires</p>
    //                     <p className="text-foreground">{prescription.expired_date.split('T')[0]}</p>
    //                 </div>
    //             </div>}
    //         </div>

    //         {/* Medications Grid */}
    //         <div className="mb-6">
    //             <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
    //                 <Pill className="w-4 h-4 text-primary" />
    //                 Medications
    //             </h4>
    //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    //                 {prescription.medications.map((med, index) => (
    //                     <div
    //                         key={index}
    //                         className="bg-muted/40 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors"
    //                     >
    //                         <div className="flex items-start gap-3">
    //                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
    //                                 <Pill className="w-4 h-4 text-primary" />
    //                             </div>
    //                             <div className="flex-1 min-w-0">
    //                                 <h5 className="font-semibold text-foreground truncate">{med.name}</h5>
    //                                 <div className="flex items-center gap-2 mt-1">
    //                                     <Badge variant="secondary" className="text-xs">
    //                                         {med.dose}
    //                                     </Badge>
    //                                     <span className="text-xs text-muted-foreground">{med.frequency}</span>
    //                                 </div>
    //                                 <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
    //                                     {med.note}
    //                                 </p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>

    //         {/* Actions */}
    //         <div className="flex flex-wrap gap-2">
    //             {prescription.status !== "expired" && (
    //                 <Button size="sm">
    //                     <RefreshCw className="w-4 h-4 mr-2" />
    //                     Request Refill
    //                 </Button>
    //             )}
    //             {prescription.status === "expired" && (
    //                 <Button
    //                     size="sm"
    //                     variant="outline"
    //                     onClick={() => navigate(`/doctor/${prescription.doctorId}`)}

    //                 >
    //                     <Calendar className="w-4 h-4 mr-2" />
    //                     Schedule Appointment
    //                 </Button>
    //             )}
    //         </div>
    //     </CardContent>
    // </Card >

    <Card className="glass-card-elevated overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Doctor & Prescription Info */}
          <div className="flex-1 px-4 py-3 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={prescription.img}
                  alt={prescription.doctor_name}
                  className="w-12 h-12 rounded-full object-cover "
                />
                <div>
                  <h3 className="font-semibold">
                    Dr.{prescription.doctor_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {prescription.doctorSpecialty}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-10 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Issued: {prescription.date.split("T")[0]}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  Expires: {prescription?.expired_date?.split("T")[0]}
                </span>
              </div>
            </div>

            {/* Medications Preview */}
            <div className="space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                Medications ({prescription.medications.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {prescription.medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gray rounded-lg px-3 py-1.5"
                  >
                    <Pill className="w-5 h-5 text-[#5A78C9]" />
                    <span className="text-xl font-medium">{med.name}</span>
                    <span className="text-base text-muted-foreground">
                      {med.dose}
                    </span>
                  </div>
                ))}
              </div>

              {notes.length > 0 && (
                <p className="text-lg font-medium text-muted-foreground">
                  Notes:
                </p>
              )}
              {notes.length > 0 ? (
                notes.map((med, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-base">
                      {med.name} : {med.note}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No notes</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
