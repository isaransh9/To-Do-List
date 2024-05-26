import React, { useState } from "react";

const DateTimeRangePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [endMeridiem, setEndMeridiem] = useState("AM");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleEndMeridiemChange = (e) => {
    setEndMeridiem(e.target.value);
  };

  return (
    <div className="flex items-center justify-center py-4">
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <input type="time" value={startTime} onChange={handleStartTimeChange} />
      {" - "}
      <input type="time" value={endTime} onChange={handleEndTimeChange} />
      <select value={endMeridiem} onChange={handleEndMeridiemChange}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default DateTimeRangePicker;
