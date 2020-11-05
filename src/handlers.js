const { format: formatDate } = require('date-fns');
const { utcWeekRange, utcDayRange } = require('./dateRange');
const { leavesBetween } = require('./leaves');
const { Notifier } = require('./notifier');

const formatWeeklyLeaveForSlack = ({ user, days }) => {
  const formattedDays = days
    .map(
      ({ Date: date, Hours: hours }) =>
        `${formatDate(Date.parse(date), 'EEEE d LLL')}, ${hours} hrs`
    )
    .join(', ');

  return `* ${user.FirstName} ${user.LastName}: ${formattedDays}`;
};

const formatDailyLeaveForSlack = ({ user, days }) => {
  const formattedHours = days.map(({ Hours }) => `${Hours} hrs`).join(', ');

  return `* ${user.FirstName} ${user.LastName}: ${formattedHours}`;
};

module.exports.weeklyReport = async () => {
  const date = new Date();
  const leaves = await leavesBetween(...utcWeekRange(date));
  const notifier = new Notifier();

  if (leaves.length) {
    notifier.bufferMessage('On leave this week:');
    leaves.forEach(leave =>
      notifier.bufferMessage(formatWeeklyLeaveForSlack(leave))
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
      notifier.bufferMessage(formatDailyLeaveForSlack(leave))
    );
  } else {
    notifier.bufferMessage('No leave booked today.');
  }

  return notifier.sendBufferedMessages();
};
