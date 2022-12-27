import { jsDateToDateTime } from './dateMath';

export const utcWeekRange = (on: Date = new Date()): [Date, Date] => {
  const targetDateTime = jsDateToDateTime(on);

  return [
    targetDateTime.startOf('week').toJSDate(),
    targetDateTime.endOf('week').toJSDate()
  ];
};

export const utcDayRange = (on: Date = new Date()): [Date, Date] => {
  const targetDateTime = jsDateToDateTime(on);

  return [
    targetDateTime.startOf('day').toJSDate(),
    targetDateTime.endOf('day').toJSDate()
  ];
};
