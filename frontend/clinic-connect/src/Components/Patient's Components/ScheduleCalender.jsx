import { useState } from "react";
import { Card, CardHeader, CardContent, Button } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Calendar } from "lucide-react";
import { toast } from "../../Hooks/UseToast.jsx";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ScheduleCalender({
  doctor,
  selectedDate,
  setSelectedDate,
  createAppointment,
}) {
  const [startHour, setStartHour] = useState("12:00");
  const [endHour, setEndHour] = useState("13:00");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const scheduleMap = new Map(
    (doctor?.schedule || []).map((s) => [s.weekday, s]),
  );

  const onBookAppointment = async () => {
    if (!selectedDate || !startHour || !endHour || !symptoms) return;

    setLoading(true);
    try {
      await createAppointment(
        {
          appointment_date: selectedDate.format("YYYY-MM-DD"),
          start_hour: startHour + ":00",
          end_hour: endHour + ":00",
          symptoms,
        },
        doctor.national_id,
      );

      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${
          doctor.name
        } is scheduled for ${selectedDate.format(
          "MMMM D, YYYY",
        )} from ${startHour} to ${endHour}.`,
        variant: "success",
        position: "top-right",
      });
      toast.success;
      setSymptoms("");
    } catch (err) {
      console.log(err.response);
      toast({
        title: "Error",
        description:
          err?.response?.data?.message || "Failed to book appointment",
        variant: "destructive",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 flex flex-col space-y-6 h-full">
      <Card
        className="card-shadow flex-1 flex flex-col"
        style={{ borderRadius: 30 }}
      >
        <CardHeader
          title={
            <div className="flex items-center gap-2 py-3 px-2">
              <Calendar className="w-10 h-10 text-[#5A78C9]" />
              <div className="text-2xl font-bold">Book an Appointment</div>
            </div>
          }
        />
        <CardContent className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <h4 className="font-semibold mb-3">Select Date</h4>
              <div className="border border-gray-300 rounded-lg p-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    disablePast
                  />
                </LocalizationProvider>
              </div>
            </div>

            {/* Start & End Time */}
            <div>
              <h4 className="font-semibold mb-3">Start & End Time</h4>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="border p-2 rounded w-1/2"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                />
                <input
                  type="time"
                  className="border p-2 rounded w-1/2"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                />
              </div>

              {/* Symptoms */}
              <h4 className="font-semibold mt-4 mb-2">Symptoms</h4>
              <textarea
                className="border rounded w-full p-2"
                rows={3}
                placeholder="Describe your symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="contained"
            className="w-full mt-auto"
            size="large"
            disabled={loading || !symptoms || !startHour || !endHour}
            onClick={onBookAppointment}
            style={{
              fontFamily: "Alan Sans, sans-serif",
             backgroundColor: loading || !symptoms || !startHour || !endHour ? "#bdbdbd" : "#5A78C9",
    color: loading || !symptoms || !startHour || !endHour ? "#666" : "#fff"
            }}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </CardContent>
      </Card>

      {/* Working Hours moved to DoctorProfile for full-width layout */}
    </div>
  );
}
