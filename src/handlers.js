const { format: formatDate } = require('date-fns');
const { utcWeekRange, utcDayRange } = require('./dateRange');
const { leavesBetween } = require('./leaves');
const { Notifier } = require('./notifier');
const FULL_DAY_CUTOFF_HOURS = 7; // Leave on or over this amount will assume a full day

const formatHours = numHours => {
  if (numHours >= FULL_DAY_CUTOFF_HOURS) {
    return 'all day';
  }

  if (numHours === 1) {
    return '1 hr';
  }

  return `${numHours} hrs`;
};

const formatForWeeklyReport = ({ user, days, withDate = true }) => {
  const formattedDays = days
    .map(
      ({ Date: date, Hours: hours }) =>
        `${
          withDate ? formatDate(Date.parse(date), 'EEE do') : ''
        } (${formatHours(hours)})`
    )
    .filter(entry => entry.length)
    .join('\n');

  const codeBlockWrappedDays = `\`\`\`${formattedDays}\`\`\``;
  const formattedName = `*${user.FirstName} ${user.LastName}*`;
  const output = `:palm_tree: ${formattedName}\n${codeBlockWrappedDays}`;

  return output;
};

const formatForDailyReport = ({ user, days }) => {
  const formattedHours = days
    .map(({ Hours: hours }) => `${formatHours(hours)}`)
    .filter(entry => entry.length > 0)
    .join(', ');

  const formattedName = `${user.FirstName} ${user.LastName}`;
  const output = `:palm_tree: ${formattedName}: ${formattedHours}`;

  return output;
};

module.exports.weeklyReport = async () => {
  const date = new Date();
  const leaves = await leavesBetween(...utcWeekRange(date));
  const notifier = new Notifier();

  if (leaves.length) {
    notifier.bufferMessage(`On leave this week:`, 'header');
    leaves.forEach(leave =>
      notifier.bufferMessage(
        formatForWeeklyReport({ ...leave, withDate: true }),
        'section'
      )
    );
  } else {
    notifier.bufferMessage('No leave booked this week.', 'section');
  }

  return notifier.sendBufferedMessages();
};

module.exports.dailyReport = async () => {
  const date = new Date();
  const leaves = await leavesBetween(...utcDayRange(date));
  const notifier = new Notifier();

  if (leaves.length) {
    notifier.bufferMessage(
      `On leave today, ${formatDate(date, 'EEEE d LLL')}:`,
      'header'
    );
    leaves.forEach(leave =>
      notifier.bufferMessage(formatForDailyReport(leave), 'section')
    );
  } else {
    notifier.bufferMessage('No leave booked today.', 'section');
  }

  return notifier.sendBufferedMessages();
};
