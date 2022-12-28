import { Context, ScheduledEvent } from 'aws-lambda';
import * as daylightSavingsChangeReminder from './daylightSavingsChangeReminder';
import * as leaveReminder from './leaveReminder';
import { Notifier } from './notifier';
import * as publicHolidayReminder from './publicHolidayReminder';

export const weeklyReport = async (
  _event: ScheduledEvent,
  _context: Context
): Promise<void> => {
  const notifier = new Notifier();

  await leaveReminder.generateWeeklyReport(notifier);
  await notifier.sendBufferedMessages();
};

export const dailyReport = async (
  _event: ScheduledEvent,
  _context: Context
): Promise<void> => {
  const notifier = new Notifier();

  await leaveReminder.generateDailyReport(notifier);
  await publicHolidayReminder.generateDailyReport(notifier);
  daylightSavingsChangeReminder.generateDailyReport(notifier);

  await notifier.sendBufferedMessages();
};
