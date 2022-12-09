

const dayStrings = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const getDayString = (dayString) => dayStrings.indexOf( dayString );
export const orderDeadLineDayIndex = () => {
  const dDayString = 'thu';
  return getDayString( dDayString );
}