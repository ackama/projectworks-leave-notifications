import { DateTime } from 'luxon';

// We always set an explicit timezone on our Luxon `DateTime` objects so that
// they never fall back to the system timezone. Falling back to the system
// timezone can give different results depending on the system.
export const toDateTime = (jsDate: Date): DateTime => {
  return DateTime.fromJSDate(jsDate, { zone: 'Pacific/Auckland' });
};

export const utcWeekRange = (
  on: Date = new Date()
): [startOfWeek: Date, endOfWeek: Date] => {
  const targetDateTime = toDateTime(on);

  return [
    targetDateTime.startOf('week').toJSDate(),
    targetDateTime.endOf('week').toJSDate()
  ];
};

export const utcDayRange = (
  on: Date = new Date()
): [startOfDay: Date, endOfDay: Date] => {
  const targetDateTime = toDateTime(on);

  return [
    targetDateTime.startOf('day').toJSDate(),
    targetDateTime.endOf('day').toJSDate()
  ];
};
