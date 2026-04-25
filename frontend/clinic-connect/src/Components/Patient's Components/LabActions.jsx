import { CalendarClock, SquareUserRound } from "lucide-react";
import { Card, CardContent, CardHeader } from "@mui/material";

function formatTime(time24) {
  if (!time24) return "";
  const [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

export function LabActions({ Lab }) {
  // const schedule = Lab?.workingHours || "9:00 AM - 5:00 PM";
  const schedule = `${formatTime(Lab.opening_time)} - ${formatTime(
    Lab.closing_time,
  )}`;

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* About Section */}
      <div className="bg-white rounded-xl shadow-none p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 py-3 px-2">
            <SquareUserRound className="w-10 h-10 text-[#5A78C9]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 m-0">
            About {Lab?.lab_name ?? "Lab Name"}
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>{Lab.about}</p>
        </div>

        {/* Compact Working Hours like pharmacy */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-8 h-8 text-[#5A78C9]" />
            <h3 className="text-xl font-semibold m-0">Working Hours</h3>
          </div>

          <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 w-full max-w-[520px] shadow-none">
            <div className="text-gray-700">{schedule}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
