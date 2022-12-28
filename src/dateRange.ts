import { toDateTime } from './dateMath';

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
