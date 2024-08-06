import dayjs from "dayjs";
import React from "react";
import Countdown from "react-countdown";

export default function Timer({ startTime, endTime, watchTime }: any) {
  const endDateTime = dayjs(endTime);
  const isTimerStarted = dayjs().isAfter(dayjs(startTime));

  if (!isTimerStarted) {
    watchTime("");
    return <span>Upcoming</span>;
  }

  return (
    <>
      <Countdown
        date={endDateTime.toDate()}
        daysInHours
        autoStart={isTimerStarted}
        zeroPadTime={2}
        renderer={({ days, hours, minutes, seconds, completed }) => {
          const duration = endDateTime.diff(dayjs(), "day");
          const months = endDateTime.diff(dayjs(), "month");
          const remainingDays = endDateTime
            .subtract(months, "month")
            .diff(dayjs(), "day");

          const monthsLabel = months > 1 ? "Months" : "Month";
          const daysLabel = remainingDays > 1 ? "Days" : "Day";

          if (completed) {
            watchTime("Hours");
            return <span>00:00</span>;
          } else if (months >= 1) {
            watchTime(`${monthsLabel} - ${daysLabel}`);
            return <span>{`${months}m - ${remainingDays}d`}</span>;
          } else if (remainingDays >= 1) {
            watchTime(`${daysLabel}`);
            return <span>{remainingDays + 1}</span>;
          } else {
            watchTime("Hours");
            return (
              <span>
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}
              </span>
            );
          }
        }}
      />
    </>
  );
}
