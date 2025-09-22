import { CALENDAR } from "/js/gameLoop.js";

const months = Object.entries(CALENDAR);
const totalDays = months.reduce((sum, [, days]) => sum + days, 0);

export function getDateFromDay(dayNumber) {
  let day = dayNumber;
  for (let [month, days] of months) {
    if (day <= days) return { month, day };
    day -= days;
  }
  return { month: "January", day: 1 };
}

export { totalDays };