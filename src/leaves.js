const { isWithinInterval } = require('date-fns');
const { fetchLeaves, fetchUser } = require('./projectworks');
const { sortByUser } = require('./sortByUsers');
const APPROVED_LEAVE_STATUS = 2;

module.exports.leavesBetween = async (startDate, endDate) => {
  const leaves = await fetchLeaves({
    startDate: startDate.toUTCString(),
    endDate: endDate.toUTCString(),
    statusId: APPROVED_LEAVE_STATUS,
    pageSize: 1000
  }).then(r => r.json());

  return sortByUser(
    await Promise.all(
      leaves.map(async leave => ({
        user: await fetchUser(leave.UserID),
        days: leave.Days.filter(({ Date: date }) =>
          isWithinInterval(Date.parse(date), {
            start: startDate,
            end: endDate
          })
        )
      }))
    )
  );
};
