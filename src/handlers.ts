import * as daylightSavingsChangeReminder from './daylightSavingsChangeReminder';
import * as leaveReminder from './leaveReminder';
import { Notifier } from './notifier';
import * as publicHolidayReminder from './publicHolidayReminder';
import type { NotifierResult } from './types';

export const weeklyReport = async (): Promise<NotifierResult> => {
  const notifier = new Notifier();

  await leaveReminder.generateWeeklyReport(notifier);

  return notifier.sendBufferedMessages();
};

export const dailyReport = async (): Promise<NotifierResult> => {
  const notifier = new Notifier();

  await leaveReminder.generateDailyReport(notifier);
  await publicHolidayReminder.generateDailyReport(notifier);
  daylightSavingsChangeReminder.generateDailyReport(notifier);

  return notifier.sendBufferedMessages();
};
