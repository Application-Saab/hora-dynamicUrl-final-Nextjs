export const generateTimeSlots = () => {
  const startTime = 7; // Starting hour
  const endTime = 22; // Ending hour
  const interval =  3; // Interval in hours

  const timeSlots = [];
  for (let hour = startTime; hour < endTime; hour += interval) {
    const startTimeFormatted = hour < 10 ? `0${hour}:00 AM` : `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    const endTimeFormatted = hour + interval < 10 ? `0${hour + interval}:00 AM` : `${(hour + interval) % 12 || 12}:00 ${hour + interval < 12 ? 'AM' : 'PM'}`;
    timeSlots.push(`${startTimeFormatted} - ${endTimeFormatted}`);
  }

  return timeSlots;
};