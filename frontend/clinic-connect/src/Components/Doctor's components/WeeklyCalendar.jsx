import { useState } from "react";
import styles from "./WeeklyCalendar.module.css";
import { useOutletContext } from "react-router-dom";

// Helper: get Monday of a given week
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Format yyyy-mm-dd
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function WeeklyCalendar({ appointments }) {
  const { searchValue = "" } = useOutletContext() || {};
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getMonday(new Date())
  );

  // Get week dates based on currentWeekStart
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: formatDate(d),
    };
  });

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  // Check if current week is today's week
  const isCurrentWeek = () => {
    const todayMonday = getMonday(new Date());
    return currentWeekStart.getTime() === todayMonday.getTime();
  };

  // Filter appointments for this week + search
  const filtered = appointments.filter(
    (a) =>
      days.some((d) => d.date === a.date) &&
      a.patientName.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Hours displayed
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8 → 18

  // Convert hour string "8:30" to float
  const hourToFloat = (hour) => {
    const [h, m] = hour.split(":");
    return parseInt(h) + (parseInt(m) || 0) / 60;
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Week Navigation */}
      <div className={styles.weekNav}>
        <button className={styles.navBtn} onClick={goToPreviousWeek}>
          ← Previous
        </button>
        <button
          className={
            isCurrentWeek() ? styles.todayBtnDisabled : styles.todayBtn
          }
          onClick={goToToday}
          disabled={isCurrentWeek()}
        >
          Today
        </button>
        <button className={styles.navBtn} onClick={goToNextWeek}>
          Next →
        </button>
      </div>

      {/* Week header */}
      <div className={styles.headerRow}>
        <div className={styles.timeColumnHeader}></div>
        {days.map((d) => (
          <div key={d.date} className={styles.dayHeader}>
            {d.label}
            <div className={styles.dateNumber}>{d.date}</div>
          </div>
        ))}
      </div>

      <div className={styles.body}>
        {/* Time column */}
        <div className={styles.timeColumn}>
          {hours.map((h) => (
            <div key={h} className={styles.timeSlot}>
              {h}:00
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {days.map((day) => (
            <div key={day.date} className={styles.dayColumn}>
              {hours.map((_, i) => (
                <div key={i} className={styles.hourCell}></div>
              ))}

              {/* Appointments */}
              {filtered
                .filter((a) => a.date === day.date)
                .map((a) => {
                  const start = hourToFloat(a.startHour);
                  const end = hourToFloat(a.endHour);
                  const top = (start - 8) * 60; // 60px per hour
                  const height = (end - start) * 60;
                  return (
                    <div
                      key={a.id}
                      className={`${styles.apptCard} ${styles[a.status]}`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <b>{a.patientName}</b>
                      <br />
                      {a.startHour} – {a.endHour}
                      <br />
                      <span className={styles.apptType}>{a.type}</span>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeeklyCalendar;
