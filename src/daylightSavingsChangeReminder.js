// @ts-nocheck

const { DateTime } = require('luxon');

module.exports.generateDailyReport = notifier => {
  const nowInWellington = DateTime.now().setZone('Pacific/Auckland');
  const nowInMelbourne = DateTime.now().setZone('Australia/Melbourne');
  const nowOffsetDiff = nowInWellington.offset - nowInMelbourne.offset;
  const nowOffsetDiffHours = nowOffsetDiff / 60;

  console.log(nowInWellington.offset, nowInMelbourne.offset, nowOffsetDiff);

  const nextWeekInWellington = nowInWellington.plus({ days: 7 });
  const nextWeekInMelbourne = nowInMelbourne.plus({ days: 7 });
  const nextWeekOffsetDiff =
    nextWeekInWellington.offset - nextWeekInMelbourne.offset;
  const nextWeekOffsetDiffHours = nextWeekOffsetDiff / 60;

  const lastWeekInWellington = nowInWellington.minus({ days: 7 });
  const lastWeekInMelbourne = nowInMelbourne.minus({ days: 7 });
  const lastWeekOffsetDiff =
    lastWeekInWellington.offset - lastWeekInMelbourne.offset;
  const lastWeekOffsetDiffHours = lastWeekOffsetDiff / 60;

  // We only deliver this report on Friday
  if (nowInWellington.weekdayLong === 'Friday') {
    if (nowOffsetDiff !== nextWeekOffsetDiff) {
      notifier.bufferMessage(
        `:warning: *Daylight savings will move your meetings next week!* Melbourne is currently *${nowOffsetDiffHours} hours* behind Wellington. Next week, Melbourne will be *${nextWeekOffsetDiffHours} hours* behind Wellington.`,
        'section'
      );
    }
  }

  // We only deliver this report on Monday
  if (nowInWellington.weekdayLong === 'Monday') {
    if (nowOffsetDiff !== lastWeekOffsetDiff) {
      notifier.bufferMessage(
        `:warning: *Daylight savings has moved your meetings this week!* Melbourne is currently *${nowOffsetDiffHours} hours* behind Wellington. Last week, Melbourne was *${lastWeekOffsetDiffHours} hours* behind Wellington.`,
        'section'
      );
    }
  }
};
