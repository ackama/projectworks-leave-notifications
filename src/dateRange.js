// @ts-nocheck

const dateFns = require('date-fns');
const LOCALE = 'en-NZ';
const WEEK_STARTS_ON = 1; // Monday

module.exports.utcWeekRange = (on = new Date()) => {
  const weekRangeOpts = { locale: LOCALE, weekStartsOn: WEEK_STARTS_ON };

  return [
    dateFns.startOfWeek(on, weekRangeOpts),
    dateFns.endOfWeek(on, weekRangeOpts)
  ];
};

module.exports.utcDayRange = (on = new Date()) => {
  const dayRangeOpts = { locale: LOCALE };

  return [
    dateFns.startOfDay(on, dayRangeOpts),
    dateFns.endOfDay(on, dayRangeOpts)
  ];
};

module.exports.utcMonthRange = (on = new Date()) => {
  return [dateFns.startOfMonth(on), dateFns.endOfMonth(on)];
};
