const dateFns = require('date-fns');
const { fetchLeaves, fetchUser } = require('./projectworks');
const APPROVED_LEAVE_STATUS = 2;

module.exports.formattedLeavesBetween = async (startDate, endDate) => {
  const leaves = await fetchLeaves({
    startDate,
    endDate,
    statusId: APPROVED_LEAVE_STATUS,
    pageSize: 1000
  }).then(r => r.json());

  let message = '';

  // Not using forEach here because it's not async/await aware.
  for (let index = 0; index < leaves.length; index++) {
    const leave = leaves[index];

    // ESLint would have us do this with a Promise.all() but procedurally we are
    // looking up the user to use for message building.
    // eslint-disable-next-line no-await-in-loop
    const user = await fetchUser(leave.UserID);
    const formattedDays = leave.Days.filter(d =>
      dateFns.isWithinInterval(Date.parse(d.Date), {
        start: Date.parse(startDate),
        end: Date.parse(endDate)
      })
    )
      .map(
        ({ Date: date, Hours: hours }) =>
          `${dateFns.format(Date.parse(date), 'EEEE d LLL')}, ${hours} hrs`
      )
      .join(', ');

    message += `${user.FirstName} ${user.LastName}: ${formattedDays}\n`;
  }

  return message;
};
