const { isWithinInterval } = require('date-fns');
const { fetchLeaves, fetchUser } = require('./projectworks');
const { sortByUser } = require('./sortByUsers');
const APPROVED_LEAVE_STATUS = 2;

module.exports.leavesBetween = async (startDate, endDate) => {
  const rawLeavesFromProjectWorks = await fetchLeaves({
    startDate: startDate.toUTCString(),
    endDate: endDate.toUTCString(),
    statusId: APPROVED_LEAVE_STATUS,
    pageSize: 1000
  }).then(r => r.json());

  const decoratedLeaves = await Promise.all(
    rawLeavesFromProjectWorks.map(async leave => ({
      user: await fetchUser(leave.UserID),
      days: leave.Days.filter(({ Date: date }) =>
        isWithinInterval(Date.parse(date), {
          start: startDate,
          end: endDate
        })
      )
    }))
  );

  // decoratedLeaves sometimes includes leaves which don't actually have any
  // days because the NZ day spans two UTC days. We cannot display anything
  // meaningful about such leaves so we filter them out.
  const decoratedLeavesWithDays = decoratedLeaves.filter(
    leave => leave.days.length > 0
  );

  return sortByUser(decoratedLeavesWithDays);
};
