import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  // Calendar as CalendarComponent
} from "@mui/material";
import {
  Star,
  Clock,
  MapPin,
  GraduationCap,
  Award,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  CheckCircle,
  SquareUserRound,
} from "lucide-react";

export function DoctorInfo({ doctor }) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="card-shadow " style={{ borderRadius: 30 }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-secondary mb-4">
              <img
                src={doctor.img}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-xl font-bold text-foreground">{doctor.name}</h1>
            <p className=" text-[#5A78C9] font-medium text-lg mt-1">
              {doctor.specialization}
            </p>

            <div className="flex items-center gap-1 mt-4">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <span className="font-semibold text-foreground text-lg">
                {doctor.rating}
              </span>
              <span className="text-muted-foreground">
                ({doctor.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="w-5 h-5 text-[#5A78C9]" />
              <span>{doctor.years_of_experience} yrs</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-[#5A78C9]" />
              <span>{doctor.address}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-[#5A78C9]" />
              <span>{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-[#5A78C9]" />
              <span>{doctor.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="card-shadow " style={{ borderRadius: 30 }}>
        <div className="px-4 pt-4">
          <Typography className="text-lg flex items-center gap-2">
            <SquareUserRound className="w-6 h-6 text-[#5A78C9]" />
            <div className="text-2xl font-bold">About {doctor.name}</div>
          </Typography>
        </div>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">
            {doctor.name} is a highly experienced{" "}
            {doctor.specialization?.toLowerCase()} specialist with{" "}
            {doctor.years_of_experience} years of dedicated practice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
