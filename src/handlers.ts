import { ScheduledHandler } from 'aws-lambda';
import { Notifier } from './adapters/notifier';
import * as daylightSavingsChangeReminder from './reminders/daylightSavingsChangeReminder';
import * as leaveReminder from './reminders/leaveReminder';
import * as publicHolidayReminder from './reminders/publicHolidayReminder';

export const weeklyReport: ScheduledHandler = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateWeeklyReport(notifier);
  await notifier.sendBufferedMessages();
};

export const dailyReport: ScheduledHandler = async () => {
  const notifier = new Notifier();

  await leaveReminder.generateDailyReport(notifier);
  await publicHolidayReminder.generateDailyReport(notifier);
  daylightSavingsChangeReminder.generateDailyReport(notifier);

  await notifier.sendBufferedMessages();
};
