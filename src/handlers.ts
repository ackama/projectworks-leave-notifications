import * as daylightSavingsChangeReminder from './daylightSavingsChangeReminder';
import * as leaveReminder from './leaveReminder';
import { Notifier } from './notifier';
import * as publicHolidayReminder from './publicHolidayReminder';

export const weeklyReport = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateWeeklyReport(notifier);

  return notifier.sendBufferedMessages();
};

export const dailyReport = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateDailyReport(notifier);
  await publicHolidayReminder.generateDailyReport(notifier);
  await daylightSavingsChangeReminder.generateDailyReport(notifier);

  return notifier.sendBufferedMessages();
};
