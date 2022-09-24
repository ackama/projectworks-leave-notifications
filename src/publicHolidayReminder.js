const { DateTime } = require('luxon');
const ical = require('node-ical');

const NZ_CALENDAR_URL =
  'https://calendar.google.com/calendar/ical/en.new_zealand%23holiday%40group.v.calendar.google.com/public/basic.ics';

// We have two options for the AU calendar. We are trying the Victoria gov one
// first because it will (presumably) have more accurate data for Melbourne and
// will avoid us having to filter out holidays from other states.
// const AU_CALENDAR_URL = 'https://calendar.google.com/calendar/ical/en.australian.official%23holiday%40group.v.calendar.google.com/public/basic.ics'
const AU_CALENDAR_URL =
  'https://www.vic.gov.au/sites/default/files/2022-09/Victorian-public-holiday-dates.ics';

const findRelevantEvents = (rawEvents, date) => {
  return Object.values(rawEvents)
    .filter(rawEvent => rawEvent.start?.toString() === date.toString())
    .map(rawEvent => {
      return {
        start: rawEvent.start,
        description: `${rawEvent.description} (${rawEvent.summary})`
      };
    });
};

const getCalendarData = async filePathOrUrl => {
  let events = [];

  if (filePathOrUrl.startsWith('http')) {
    events = await ical.async.fromURL(filePathOrUrl);
  } else {
    events = await ical.async.parseFile(filePathOrUrl);
  }

  return events;
};

const getStartOfTodayInUTC = () => {
  return DateTime.local({ zone: 'Pacific/Auckland' })
    .startOf('day')
    .toUTC()
    .toJSDate();
};

module.exports.generateDailyReport = async (
  notifier,
  {
    startOfTodayInUTC = getStartOfTodayInUTC(),
    nzCalendarUrl = NZ_CALENDAR_URL,
    auCalendarUrl = AU_CALENDAR_URL
  } = {}
) => {
  const nzPublicHolidays = await getCalendarData(nzCalendarUrl);
  const auPublicHolidays = await getCalendarData(auCalendarUrl);
  const nzEvents = findRelevantEvents(nzPublicHolidays, startOfTodayInUTC);
  const auEvents = findRelevantEvents(auPublicHolidays, startOfTodayInUTC);

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
