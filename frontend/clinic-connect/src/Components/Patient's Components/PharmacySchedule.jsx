import { useState } from "react";
import { CalendarClock, SquareUserRound } from "lucide-react";
/* ================= TIME FORMAT HELPER ================= */
const formatTime = (time) => {
  if (!time) return "—";

  const [hour, minute] = time.split(":");
  const h = Number(hour);

  const period = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;

  return `${formattedHour}:${minute} ${period}`;
};

export function PharmacySchedule({ Pharmacy }) {
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const workingHours = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* ================= ABOUT SECTION ================= */}
      <div className="bg-white rounded-xl shadow-none p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 py-3 px-2">
            <SquareUserRound className="w-10 h-10 text-[#5A78C9]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-0">
            About {Pharmacy.pharmacy_name}
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>{Pharmacy.about}</p>
        </div>

        {/* ================= WORKING HOURS ================= */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-[#5A78C9]" />
            <h3 className="text-xl font-semibold m-0">Working Hours</h3>
          </div>

          <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 max-w-[520px] w-full shadow-none">
            <div className="text-gray-700">
              {formatTime(Pharmacy.opening_time)} &ndash;{" "}
              {formatTime(Pharmacy.closing_time)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
