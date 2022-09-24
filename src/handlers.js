const daylightSavingsChangeReminder = require('./daylightSavingsChangeReminder');
const leaveReminder = require('./leaveReminder');
const { Notifier } = require('./notifier');
const publicHolidayReminder = require('./publicHolidayReminder');

module.exports.weeklyReport = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateWeeklyReport(notifier);

  return notifier.sendBufferedMessages();
};

module.exports.dailyReport = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateDailyReport(notifier);
  await publicHolidayReminder.generateDailyReport(notifier);
  await daylightSavingsChangeReminder.generateDailyReport(notifier);

  return notifier.sendBufferedMessages();
};
