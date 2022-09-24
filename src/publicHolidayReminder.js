const { DateTime } = require('luxon');
const ical = require('node-ical');

const nzCalendarUrl =
  'https://calendar.google.com/calendar/ical/en.new_zealand%23holiday%40group.v.calendar.google.com/public/basic.ics';

// We have two options for the AU calendar. We are trying the Victoria gov one
// first because it will (presumably) have more accurate data for Melbourne and
// will avoid us having to filter out holidays from other states.
// const auCalendarUrl = 'https://calendar.google.com/calendar/ical/en.australian.official%23holiday%40group.v.calendar.google.com/public/basic.ics'
const auCalendarUrl =
  'https://www.vic.gov.au/sites/default/files/2022-09/Victorian-public-holiday-dates.ics';

const findEventsForDate = (rawEvents, date) => {
  return Object.values(rawEvents)
    .filter(rawEvent => rawEvent.start?.toString() === date.toString())
    .map(rawEvent => {
      return {
        start: rawEvent.start,
        description: `${rawEvent.description} (${rawEvent.summary})`
      };
    });
};

module.exports.generateDailyReport = async notifier => {
  const nzPublicHolidays = await ical.async.fromURL(nzCalendarUrl);
  const auPublicHolidays = await ical.async.fromURL(auCalendarUrl);

  const startOfTodayInUTC = DateTime.now().startOf('day').toUTC().toJSDate();

  const nzEvents = findEventsForDate(nzPublicHolidays, startOfTodayInUTC);
  const auEvents = findEventsForDate(auPublicHolidays, startOfTodayInUTC);

  if (nzEvents.length || auEvents.length) {
    notifier.bufferMessage(`*Public holidays (beta):*`, 'section');
  }

  nzEvents.forEach(nzEvent =>
    notifier.bufferMessage(
      `:flag-nz: New Zealand: ${nzEvent.description}`,
      'section'
    )
  );

  auEvents.forEach(auEvent =>
    notifier.bufferMessage(
      `:flag-au: Australia: ${auEvent.description}`,
      'section'
    )
  );
};
