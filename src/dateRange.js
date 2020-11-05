const dateFns = require('date-fns');
const LOCALE = 'en-NZ';
const WEEK_STARTS_ON = 1; // Monday

module.exports.utcWeekRange = (on = new Date()) => {
  const weekRangeOpts = { locale: LOCALE, weekStartsOn: WEEK_STARTS_ON };

  return [
    dateFns.startOfWeek(on, weekRangeOpts).toUTCString(),
    dateFns.endOfWeek(on, weekRangeOpts).toUTCString()
  ];
};

module.exports.utcDayRange = (on = new Date()) => {
  const dayRangeOpts = { locale: LOCALE };

  return [
    dateFns.startOfDay(on, dayRangeOpts),
    dateFns.endOfDay(on, dayRangeOpts)
  ];
};
