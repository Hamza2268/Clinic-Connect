// import { useEffect, useState } from "react";
// import styles from "./ShiftSchedule.module.css";

// const days = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// function ShiftSchedule() {
//   // ---------------------------------------------------
//   // FAKE DATA (use this while backend doesn't exist)
//   // ---------------------------------------------------
//   const fakeSchedule = [
//     { day: "Monday", start: "09:00", end: "17:00" },
//     { day: "Tuesday", start: "09:00", end: "17:00" },
//     { day: "Wednesday", start: "09:00", end: "17:00" },
//     { day: "Thursday", start: "09:00", end: "17:00" },
//     { day: "Friday", start: "09:00", end: "17:00" },
//     { day: "Saturday", start: "00:00", end: "00:00" },
//     { day: "Sunday", start: "00:00", end: "00:00" },
//   ];

//   const fakeAppointments = [
//     {
//       weekday: 0, // Monday
//       startHour: "10:00",
//       endHour: "10:30",
//     },
//     {
//       weekday: 2, // Wednesday
//       startHour: "14:00",
//       endHour: "15:00",
//     },
//     {
//       weekday: 4, // Friday
//       startHour: "16:30",
//       endHour: "17:00",
//     },
//   ];

//   // ---------------------------------------------------
//   // STATE
//   // ---------------------------------------------------
//   const [schedule, setSchedule] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   // ---------------------------------------------------
//   // LOAD DATA (using fake data for now)
//   // ---------------------------------------------------
//   useEffect(() => {
//     // --- REAL BACKEND (commented out) -----------------
//     /*
//     const loadData = async () => {
//       try {
//         const scheduleRes = await fetch("/api/doctor/schedule");
//         const scheduleData = await scheduleRes.json();

//         const apptRes = await fetch("/api/doctor/appointments");
//         const apptData = await apptRes.json();

//         setSchedule(scheduleData);
//         setAppointments(apptData);
//       } catch (err) {
//         console.error("Failed to load schedule:", err);
//       }
//     };

//     loadData();
//     */

//     // --- FAKE DATA FOR TESTING ------------------------
//     setSchedule(fakeSchedule);
//     setAppointments(fakeAppointments);
//   }, []);

//   // ---------------------------------------------------
//   // UPDATE SHIFT FOR A DAY
//   // ---------------------------------------------------
//   const updateShift = (index, field, value) => {
//     const updated = [...schedule];
//     updated[index][field] = value;
//     setSchedule(updated);
//   };

//   // ---------------------------------------------------
//   // VALIDATE BEFORE SAVING
//   // ---------------------------------------------------
//   const validateSchedule = () => {
//     for (let appt of appointments) {
//       const dayIdx = appt.weekday;

//       const shift = schedule[dayIdx];

//       const apptStart = parseInt(appt.startHour.replace(":", ""));
//       const apptEnd = parseInt(appt.endHour.replace(":", ""));

//       const shiftStart = parseInt(shift.start.replace(":", ""));
//       const shiftEnd = parseInt(shift.end.replace(":", ""));

//       if (apptStart < shiftStart || apptEnd > shiftEnd) {
//         return `The appointment on ${days[dayIdx]} (${appt.startHour} - ${appt.endHour}) is outside the new working hours!`;
//       }
//     }

//     return null;
//   };

//   // ---------------------------------------------------
//   // SAVE SCHEDULE (real API commented out)
//   // ---------------------------------------------------
//   const saveSchedule = async () => {
//     setError("");

//     const conflict = validateSchedule();
//     if (conflict) {
//       setError(conflict);
//       return;
//     }

//     setSaving(true);

//     // --- REAL SAVE (commented) -------------------------
//     /*
//     try {
//       await fetch("/api/doctor/schedule", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(schedule),
//       });

//       alert("Schedule updated successfully!");
//       setSaving(false);
//     } catch (err) {
//       console.error("Failed to save schedule:", err);
//       setSaving(false);
//     }
//     */

//     // --- FAKE SAVE ------------------------------------
//     setTimeout(() => {
//       alert("Fake save: Schedule updated successfully!");
//       setSaving(false);
//     }, 800);
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Shift Schedule</h1>

//       {error && <p className={styles.error}>{error}</p>}

//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Day</th>
//             <th>Shift Start</th>
//             <th>Shift End</th>
//           </tr>
//         </thead>

//         <tbody>
//           {schedule.map((day, index) => (
//             <tr key={index}>
//               <td>{day.day}</td>

//               <td>
//                 <input
//                   type="time"
//                   className={styles.timeInput}
//                   value={day.start}
//                   onChange={(e) => updateShift(index, "start", e.target.value)}
//                 />
//               </td>

//               <td>
//                 <input
//                   type="time"
//                   className={styles.timeInput}
//                   value={day.end}
//                   onChange={(e) => updateShift(index, "end", e.target.value)}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button
//         className={styles.saveBtn}
//         onClick={saveSchedule}
//         disabled={saving}
//       >
//         {saving ? "Saving..." : "Save Schedule"}
//       </button>
//     </div>
//   );
// }

// export default ShiftSchedule;

import { useContext, useEffect, useState } from "react";
import styles from "./ShiftSchedule.module.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { DoctorsContext } from "../../Context/DoctorsContext";

/* ---------- FAKE DATA (same idea as your original) ---------- */
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const fakeSchedule = [
  { day: "Monday", start: "09:00", end: "17:00" },
  { day: "Tuesday", start: "09:00", end: "17:00" },
  { day: "Wednesday", start: "09:00", end: "17:00" },
  { day: "Thursday", start: "09:00", end: "17:00" },
  { day: "Friday", start: "09:00", end: "17:00" },
  { day: "Saturday", start: "00:00", end: "00:00" },
  { day: "Sunday", start: "00:00", end: "00:00" },
];

const fakeAppointments = [
  { weekday: 0, startHour: "10:00", endHour: "10:30" }, // Monday
  { weekday: 2, startHour: "14:00", endHour: "15:00" }, // Wednesday
  { weekday: 4, startHour: "16:30", endHour: "17:00" }, // Friday
];

function toMinutes(t) {
  if (!t) return null;
  const [hh, mm] = t.split(":").map((v) => parseInt(v, 10));
  return hh * 60 + mm;
}

function minutesToHoursStr(minutes) {
  if (minutes == null) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function ShiftSchedule() {
  // State
  const [schedule, setSchedule] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editedSchedule, setEditedSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const {
    shiftSchedule,
    getShiftSchedule,
    updateShiftSchedule,
    addShiftScheduleData,
  } = useContext(DoctorsContext);
  // deleteShiftSchedule is optional but provided by DoctorsContext
  const { deleteShiftSchedule } = useContext(DoctorsContext);

  // Load real schedule on mount (falls back to fake data)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getShiftSchedule();
        if (data && Array.isArray(data) && data.length > 0) {
          // build schedule array for Mon-Sun (weekday 0..6)
          const built = days.map((day, idx) => {
            const entry = data.find((d) => Number(d.weekday) === idx);
            return {
              day,
              start: entry && entry.start_hour ? entry.start_hour : "00:00",
              end: entry && entry.end_hour ? entry.end_hour : "00:00",
            };
          });
          setSchedule(built);
          setEditedSchedule(built.map((s) => ({ ...s })));
        } else {
          setSchedule(fakeSchedule);
          setEditedSchedule(fakeSchedule.map((s) => ({ ...s })));
        }
        // setAppointments(fakeAppointments);
      } catch (err) {
        // fallback to fake data on error
        console.log(err.message);
        setSchedule(fakeSchedule);
        setEditedSchedule(fakeSchedule.map((s) => ({ ...s })));
        // setAppointments(fakeAppointments);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Begin editing
  const startEdit = () => {
    setEditedSchedule(schedule.map((s) => ({ ...s })));
    setIsEditing(true);
    setError("");
  };

  // Cancel edits
  const cancelEdit = () => {
    setEditedSchedule(schedule.map((s) => ({ ...s })));
    setIsEditing(false);
    setError("");
  };

  // Update a shift value while editing
  const updateShift = (idx, field, value) => {
    const copy = editedSchedule.map((s) => ({ ...s }));
    copy[idx][field] = value;
    setEditedSchedule(copy);
  };

  // Set a day to Off: call delete on server immediately and refresh UI
  const setDayOff = async (idx) => {
    setSaving(true);
    try {
      const weekdayName = days[idx];

      if (typeof deleteShiftSchedule === "function") {
        await deleteShiftSchedule(weekdayName);
      } else {
        // If delete not available, fall back to marking as 00:00 locally
        const copy = editedSchedule.map((s) => ({ ...s }));
        copy[idx].start = "00:00";
        copy[idx].end = "00:00";
        setEditedSchedule(copy);
      }

      // refresh client schedule from server
      const refreshed = await getShiftSchedule();
      if (refreshed && Array.isArray(refreshed)) {
        const built = days.map((day, idx2) => {
          const entry = refreshed.find((d) => Number(d.weekday) === idx2);
          return {
            day,
            start: entry && entry.start_hour ? entry.start_hour : "00:00",
            end: entry && entry.end_hour ? entry.end_hour : "00:00",
          };
        });
        setSchedule(built);
        setEditedSchedule(built.map((s) => ({ ...s })));
      }
    } catch (err) {
      console.error("Failed to set day off:", err);
    } finally {
      setSaving(false);
    }
  };

  // Save (fake) - simplified: no appointment conflict checks
  const saveSchedule = async () => {
    setError("");

    // basic sanity: ensure start < end when both provided
    for (let s of editedSchedule) {
      const start = s.start === "00:00" ? "" : s.start;
      const end = s.end === "00:00" ? "" : s.end;
      if (start && end) {
        const st = toMinutes(start);
        const en = toMinutes(end);
        if (st >= en) {
          setError(`Shift start must be before end for ${s.day}`);
          return;
        }
      }
    }

    setSaving(true);

    try {
      // ensure shiftSchedule from context is available
      const existing = Array.isArray(shiftSchedule) ? shiftSchedule : [];

      // Update or add each day's schedule via the context methods
      for (let idx = 0; idx < editedSchedule.length; idx++) {
        const s = editedSchedule[idx];
        const start = s.start === "00:00" ? null : s.start;
        const end = s.end === "00:00" ? null : s.end;

        const weekdayName = days[idx];
        const found = existing.find(
          (e) => String(e.weekday) === weekdayName || Number(e.weekday) === idx
        );

        // If both start and end provided and valid -> create/update
        if (start && end) {
          if (toMinutes(start) >= toMinutes(end)) {
            // skip invalid ranges (shouldn't happen because validated earlier)
            continue;
          }

          if (found) {
            await updateShiftSchedule(weekdayName, start, end);
          } else {
            await addShiftScheduleData(start, end, weekdayName);
          }
        } else {
          // Off day: if existing record exists, delete it
          if (found) {
            if (typeof deleteShiftSchedule === "function") {
              await deleteShiftSchedule(weekdayName);
            }
          }
        }
      }

      // refresh from server
      const refreshed = await getShiftSchedule();
      if (refreshed && Array.isArray(refreshed)) {
        const built = days.map((day, idx) => {
          const entry = refreshed.find((d) => Number(d.weekday) === idx);
          return {
            day,
            start: entry && entry.start_hour ? entry.start_hour : "00:00",
            end: entry && entry.end_hour ? entry.end_hour : "00:00",
          };
        });
        setSchedule(built);
        setEditedSchedule(built.map((s) => ({ ...s })));
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save schedule:", err);
      setError("Failed to save schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Helpers for display
  const displayTime = (t) => {
    if (!t || t === "00:00") return "Off";
    const [hh, mm] = t.split(":").map((v) => parseInt(v, 10));
    const ampm = hh >= 12 ? "PM" : "AM";
    const displayH = hh % 12 || 12;
    return `${displayH}:${mm.toString().padStart(2, "0")} ${ampm}`;
  };

  const current = isEditing ? editedSchedule : schedule;

  // Stats
  const totalMinutes = schedule.reduce((acc, s) => {
    const start = s.start === "00:00" ? "" : s.start;
    const end = s.end === "00:00" ? "" : s.end;
    if (!start || !end) return acc;
    const diff = toMinutes(end) - toMinutes(start);
    return acc + Math.max(0, diff);
  }, 0);

  const workingDaysCount = schedule.filter((s) => {
    const start = s.start === "00:00" ? "" : s.start;
    const end = s.end === "00:00" ? "" : s.end;
    return start && end;
  }).length;

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Shift Schedule</h1>
          <p className={styles.subtitle}>Manage your weekly working hours</p>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button
                className={styles.btnOutline}
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={saveSchedule}
                disabled={saving}
              >
                {saving ? <span className={styles.spinner} /> : "Save Changes"}
              </button>
            </>
          ) : (
            <button className={styles.btnPrimary} onClick={startEdit}>
              Edit Schedule
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && <div className={styles.errorBox}>{error}</div>}

      {/* Table card */}
      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thDay}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16 2v4M8 2v4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Day
                </th>
                <th>Shift Start</th>
                <th>Shift End</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {current.map((d, idx) => {
                // determine off
                const startRaw = d.start === "00:00" ? "" : d.start;
                const endRaw = d.end === "00:00" ? "" : d.end;
                const isOff = !startRaw || !endRaw;
                let durationMin = null;
                if (!isOff) {
                  durationMin = toMinutes(endRaw) - toMinutes(startRaw);
                  if (durationMin < 0) durationMin = 0;
                }

                return (
                  <tr key={d.day} className={styles.row}>
                    <td className={styles.tdDay}>
                      <div className={styles.dayName}>{d.day}</div>
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="time"
                          className={styles.timeInput}
                          value={d.start}
                          onChange={(e) =>
                            updateShift(idx, "start", e.target.value)
                          }
                        />
                      ) : (
                        <span className={isOff ? styles.muted : ""}>
                          {displayTime(d.start)}
                        </span>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="time"
                          className={styles.timeInput}
                          value={d.end}
                          onChange={(e) =>
                            updateShift(idx, "end", e.target.value)
                          }
                        />
                      ) : (
                        <span className={isOff ? styles.muted : ""}>
                          {displayTime(d.end)}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={isOff ? styles.muted : ""}>
                        {isOff ? "-" : minutesToHoursStr(durationMin)}
                      </span>
                    </td>

                    <td>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className={styles.btnOutline}
                            onClick={() => setDayOff(idx)}
                            disabled={saving}
                            type="button"
                          >
                            Set Day Off
                          </button>
                        </div>
                      ) : isOff ? (
                        <span
                          className={`${styles.badge} ${styles.badgeMuted}`}
                        >
                          Day Off
                        </span>
                      ) : (
                        <span
                          className={`${styles.badge} ${styles.badgeSuccess}`}
                        >
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} aria-hidden>
            <AccessTimeIcon className={styles.statIconInner} />
          </div>
          <div>
            <div className={styles.statLabel}>Total Hours</div>
            <div className={styles.statValue}>
              {minutesToHoursStr(totalMinutes)}
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} aria-hidden>
            <CalendarTodayIcon className={styles.statIconInner} />
          </div>
          <div>
            <div className={styles.statLabel}>Working Days</div>
            <div className={styles.statValue}>{workingDaysCount}</div>
          </div>
        </div>

        {/* <div className={styles.statCard}>
          <div className={styles.statIcon} aria-hidden>
            <LocalHospitalIcon className={styles.statIconInner} />
          </div>
          <div>
            <div className={styles.statLabel}>Booked Appointments</div>
            <div className={styles.statValue}>{bookedCount}</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
