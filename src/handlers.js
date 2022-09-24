const daylightSavingsChangeReminder = require('./daylightSavingsChangeReminder');
const leaveReminder = require('./leaveReminder');
const { Notifier } = require('./notifier');

module.exports.weeklyReport = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateWeeklyReport(notifier);

  return notifier.sendBufferedMessages();
};

module.exports.dailyReport = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateDailyReport(notifier);
  await daylightSavingsChangeReminder.generateReport(notifier);

  return notifier.sendBufferedMessages();
};
