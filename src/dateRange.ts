import { DateTime } from 'luxon';

const LOCALE = 'en-NZ';

export const utcWeekRange = (on: Date = new Date()): [Date, Date] => {
  const targetDate = DateTime.fromJSDate(on).setLocale(LOCALE);

  return [
    targetDate.startOf('week').toJSDate(),
    targetDate.endOf('week').toJSDate()
  ];
};

export const utcDayRange = (on: Date = new Date()): [Date, Date] => {
  const targetDate = DateTime.fromJSDate(on).setLocale(LOCALE);

  return [
    targetDate.startOf('day').toJSDate(),
    targetDate.endOf('day').toJSDate()
  ];
};
