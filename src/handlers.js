const { format: formatDate } = require('date-fns');
const { utcWeekRange, utcDayRange } = require('./dateRange');
const { leavesBetween } = require('./leaves');
const { Notifier } = require('./notifier');
const FULL_DAY_CUTOFF_HOURS = 7; // Leave over this amount will assume a full day

const formatLeaveForSlack = ({ user, days, withDate = true }) => {
  const formattedDays = days
    .map(
      ({ Date: date, Hours: hours }) =>
        `${withDate ? formatDate(Date.parse(date), 'EEEE d LLL') : ''}${
          hours <= FULL_DAY_CUTOFF_HOURS ? `, ${hours} hrs` : ''
        }`
    )
    .filter(entry => entry.length)
    .join(', ');

  return `* ${user.FirstName} ${user.LastName}${
    formattedDays.length ? `: ${formattedDays}` : ''
  }`;
};

module.exports.weeklyReport = async () => {
  const date = new Date();
  const leaves = await leavesBetween(...utcWeekRange(date));
  const notifier = new Notifier();

  if (leaves.length) {
    notifier.bufferMessage('On leave this week:');
    leaves.forEach(leave =>
      notifier.bufferMessage(formatLeaveForSlack({ ...leave, withDate: true }))
    );
  } else {
    notifier.bufferMessage('No leave booked this week.');
  }

  return notifier.sendBufferedMessages();
};

module.exports.dailyReport = async () => {
  const date = new Date();
  const leaves = await leavesBetween(...utcDayRange(date));
  const notifier = new Notifier();

  if (leaves.length) {
    notifier.bufferMessage(
      `On leave today, ${formatDate(date, 'EEEE d LLL')}:`
    );
    leaves.forEach(leave =>
      notifier.bufferMessage(formatLeaveForSlack({ ...leave, withDate: false }))
    );
  } else {
    notifier.bufferMessage('No leave booked today.');
  }

  return notifier.sendBufferedMessages();
};
