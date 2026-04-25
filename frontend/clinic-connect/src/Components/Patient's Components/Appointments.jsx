import { CalendarDays, FileText, Clock } from "lucide-react";
import { AppointmentCard } from "./AppointmentCard";
import { useEffect, useState } from "react";

export const Appointments = ({ appointments }) => {
  // const sortedAppointments = appointments.sort((a, b) => {
  //     const statusOrder = { upcoming: 0, completed: 1, cancelled: 2 };
  //     const orderDiff = statusOrder[a.status] - statusOrder[b.status];

  //     if (orderDiff !== 0) return orderDiff;

  //     return new Date(a.date).getTime() - new Date(b.date).getTime();
  // });

  // Convert to array safely
  const appointmentsArray = Array.isArray(appointments) ? appointments : [];

  const [apps, setApps] = useState(appointmentsArray);
  console.log(apps);
  useEffect(() => {
    const arr = Array.isArray(appointments) ? appointments : [];
    setApps(arr);
  }, [appointments]);

  const upcomingCount = apps.filter(
    (a) => a.status.toLowerCase() === "upcoming",
  ).length;
  const completedCount = apps.filter(
    (a) => a.status.toLowerCase() === "completed",
  ).length;
  const missedCount = apps.filter(
    (a) => a.status.toLowerCase() === "missed",
  ).length;

  return (
    <section className="w-full">
      <div className="flex items-top gap-3 mb-6">
        {/* <div className="w-10 h-10 rounded-lg  flex items-center justify-center mt-1">
          <CalendarDays className="w-15 h-15 text-[#5A78C9]" />
        </div> */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Appointments
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your healthcare appointments and stay connected with your
                doctors
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-18 mt-6">
            <div className="flex items-center gap-3 bg-white pl-[20px] pr-[150px] py-2 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CalendarDays className="w-6 h-6 text-[#5A78C9]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-0">
                  {upcomingCount}
                </div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white pl-[20px] pr-[150px] py-2 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-0">
                  {completedCount}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white pl-[20px] pr-[150px] py-2 rounded-lg">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-0">
                  {missedCount}
                </p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {apps.map((appointment, index) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
