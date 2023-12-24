import { ScheduledHandler } from 'aws-lambda';
import * as daylightSavingsChangeReminder from './daylightSavingsChangeReminder';
import * as leaveReminder from './leaveReminder';
import { Notifier } from './notifier';
import * as publicHolidayReminder from './publicHolidayReminder';
import * as significantStaffDatesReminder from './significantStaffDatesReminder';

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
  await significantStaffDatesReminder.generateDailyReport(notifier);

  await notifier.sendBufferedMessages();
};
