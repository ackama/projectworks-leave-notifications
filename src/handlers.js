const { format: formatDate } = require('date-fns');
const { utcWeekRange, utcDayRange } = require('./dateRange');
const { leavesBetween } = require('./leaves');
const { Notifier } = require('./notifier');
const FULL_DAY_CUTOFF_HOURS = 7; // Leave over this amount will assume a full day

const formatLeaveForSlack = ({ user, days, withDate = true }) => {
  const formattedDays = days
    .map(
      ({ Date: date, Hours: hours }) =>
        `${withDate ? formatDate(Date.parse(date), 'EEE do') : ''}${
          hours < FULL_DAY_CUTOFF_HOURS ? ` (${hours} hrs)` : ' (all day)'
        }`
    )
    .filter(entry => entry.length)
    .join('\n');

  // I don't know why the ProjectWorks API does this sometimes
  if (!formattedDays.length) {
    return ' ';
  }

  const codeBlockWrappedDays = `\`\`\`${formattedDays}\`\`\``;
  const formattedName = `*${user.FirstName} ${user.LastName}*`;
  const output = `:palm_tree: ${formattedName}\n${codeBlockWrappedDays}`;

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
        formatLeaveForSlack({ ...leave, withDate: true }),
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
      notifier.bufferMessage(
        formatLeaveForSlack({ ...leave, withDate: false }),
        'section'
      )
    );
  } else {
    notifier.bufferMessage('No leave booked today.', 'section');
  }

  return notifier.sendBufferedMessages();
};
