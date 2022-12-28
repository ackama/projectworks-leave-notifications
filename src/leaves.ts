import { DateTime, Interval } from 'luxon';
import { fetchLeaves, fetchUser } from './projectworks';
import { sortByUser } from './sortByUsers';
import type { Leave, ProjectWorksLeave } from './types';

const APPROVED_LEAVE_STATUS = 2;

export const leavesBetween = async (
  startDate: Date,
  endDate: Date
): Promise<Leave[]> => {
  const rawLeavesFromProjectWorks = await fetchLeaves({
    startDate: startDate.toUTCString(),
    endDate: endDate.toUTCString(),
    statusId: APPROVED_LEAVE_STATUS.toString(),
    pageSize: (1000).toString()
  });

  const intervalOfInterest = Interval.fromDateTimes(startDate, endDate);

  const leaves = await Promise.all(
    rawLeavesFromProjectWorks.map(
      async (leave: ProjectWorksLeave): Promise<Leave> => {
        return {
          user: await fetchUser(leave.UserID),
          days: leave.Days.filter(({ Date: date }) =>
            intervalOfInterest.contains(DateTime.fromISO(date))
          )
        };
      }
    )
  );

  // leaves sometimes includes leaves which don't actually have any
  // days because the NZ day spans two UTC days. We cannot display anything
  // meaningful about such leaves so we filter them out.
  const leavesWithDays = leaves.filter(leave => leave.days.length > 0);

  return sortByUser(leavesWithDays);
};
