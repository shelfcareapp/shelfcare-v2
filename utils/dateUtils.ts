export const formatTxtToDates = (text: string) =>
  text
    .split('\n')
    .map((row) => row.split(/(?<=^\S+)\s/))
    .map((element) => {
      return {
        date: element[0],
        time: element[1]
      };
    });
export function removeDuplicates(dates) {
  const uniqueDates = new Map();
  dates?.forEach((date) => {
    uniqueDates.set(date.date.toISOString(), date);
  });
  return Array.from(uniqueDates.values());
}
