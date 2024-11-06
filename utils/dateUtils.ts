export function formatTxtToDates(datesText: string) {
  const lines = datesText.split('\n');

  const formatted = lines
    .filter((line) => line.trim())
    .map((line) => {
      const [datePart, timePart] = line.split(' klo ');

      const startTime = timePart.split('-')[0];

      const formattedTime = startTime.replace('.', ':');

      const dateTimeStr = `${datePart} ${formattedTime}`;

      const parsedDate = new Date(dateTimeStr);

      return {
        date: parsedDate,
        details: timePart.trim(),
        displayTime: timePart.trim()
      };
    })
    .filter((item) => !isNaN(item.date.getTime()));

  return formatted;
}

export function removeDuplicates(dates) {
  const uniqueDates = new Map();
  dates.forEach((date) => {
    uniqueDates.set(date.date.toISOString(), date);
  });
  return Array.from(uniqueDates.values());
}

export function getNextEightDays(
  dateStr: string,
  returnDates: string[]
): string[] {
  const date = dateStr?.split(' - ')[0];
  const index = returnDates.findIndex((item) => item.includes(date));

  // 16 because each date has two time slots
  return returnDates.slice(index + 16);
}
