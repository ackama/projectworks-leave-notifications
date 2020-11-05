const { utcWeekRange, utcDayRange } = require('./dateRange');
const { formattedLeavesBetween } = require('./leaves');

module.exports.weeklyReport = async () => {
  const [startDate, endDate] = utcWeekRange();

  return formattedLeavesBetween(startDate, endDate);
};

module.exports.dailyReport = async () => {
  const [startDate, endDate] = utcDayRange();

  return formattedLeavesBetween(startDate, endDate);
};
