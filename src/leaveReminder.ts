import { toDateTime } from './dateMath';
import { utcDayRange, utcWeekRange } from './dateRange';
import { leavesBetween } from './leaves';
import type { Notifier } from './notifier';
import type { Leave } from './types';

const FULL_DAY_CUTOFF_HOURS = 7; // Leave on or over this amount will assume a full day

const formatHours = (numHours: number) => {
  if (numHours >= FULL_DAY_CUTOFF_HOURS) {
    return 'all day';
  }

  if (numHours === 1) {
    return '1 hr';
  }

  return `${numHours} hrs`;
};

const formatForDailyReport = ({ user, days }: Leave) => {
  const formattedHours = days
    .map(({ Hours: hours }) => `${formatHours(hours)}`)
    .filter(entry => entry.length > 0)
    .join(', ');

  const formattedName = `${user.FirstName} ${user.LastName}`;
  const output = `:palm_tree: ${formattedName}: ${formattedHours}`;

  return output;
};

const formatForWeeklyReport = ({ user, days }: Leave, withDate = true) => {
  const formattedDays = days
    .map(
      ({ Date: dateStr, Hours: hours }) =>
        `${
          withDate ? toDateTime(new Date(dateStr)).toFormat('EEE d LLL') : ''
        } (${formatHours(hours)})`
    )
    .filter(entry => entry.length)
    .join('\n');

  const codeBlockWrappedDays = `\`\`\`${formattedDays}\`\`\``;
  const formattedName = `*${user.FirstName} ${user.LastName}*`;
  const output = `:palm_tree: ${formattedName}\n${codeBlockWrappedDays}`;

  return output;
};

export const generateDailyReport = async (
  notifier: Notifier
): Promise<void> => {
  const date = new Date();
  const leaves = await leavesBetween(...utcDayRange(date));

  if (leaves.length) {
    notifier.bufferMessage(
      `*On leave today, ${toDateTime(date).toFormat('EEEE d LLL')}:*`,
      'section'
    );
    leaves.forEach(leave =>
      notifier.bufferMessage(formatForDailyReport(leave), 'section')
    );
  } else {
    notifier.bufferMessage('No leave booked today.', 'section');
  }
};

export const generateWeeklyReport = async (
  notifier: Notifier
): Promise<void> => {
  const date = new Date();
  const leaves = await leavesBetween(...utcWeekRange(date));

  if (leaves.length) {
    notifier.bufferMessage(`*On leave this week:*`, 'section');
    leaves.forEach(leave =>
      notifier.bufferMessage(formatForWeeklyReport(leave, true), 'section')
    );
  } else {
    notifier.bufferMessage('No leave booked this week.', 'section');
  }
};
