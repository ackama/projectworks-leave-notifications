import {
  CalendarComponent,
  CalendarResponse,
  DateWithTimeZone,
  VEvent,
  async as ical
} from 'node-ical';
import { Notifier } from '../notifier';
import { toDateTime } from '../util/dateMath';

const NZ_CALENDAR_URL =
  'https://calendar.google.com/calendar/ical/en.new_zealand%23holiday%40group.v.calendar.google.com/public/basic.ics';

// We have two options for the AU calendar. We are trying the Victoria gov one
// first because it will (presumably) have more accurate data for Melbourne and
// will avoid us having to filter out holidays from other states.
// const AU_CALENDAR_URL = 'https://calendar.google.com/calendar/ical/en.australian.official%23holiday%40group.v.calendar.google.com/public/basic.ics'
const AU_CALENDAR_URL =
  'https://content.vic.gov.au/sites/default/files/2022-09/Victorian-public-holiday-dates.ics';

const toDateStamp = (date: Date): string => {
  return toDateTime(date).toFormat('yyyy-MM-dd');
};

// The data we get from the calendars has start and end timestamps in UTC
// timezone but are marked "date only". This means that the date part of the
// timestamp is the correct day in NZ and the time and zone parts should be
// ignored.
//
// Example event:
//
//   '20230206_gs3e5e1rf77kjcdoo582od5b38@google.com': {
//       type: 'VEVENT',
//       params: [],
//       start: 2023-02-06T00:00:00.000Z { dateOnly: true },
//       datetype: 'date',
//       end: 2023-02-07T00:00:00.000Z { dateOnly: true },
//       dtstamp: 2022-09-22T23:12:39.000Z { tz: 'Etc/UTC' },
//       uid: '20230206_gs3e5e1rf77kjcdoo582od5b38@google.com',
//       class: 'PUBLIC',
//       created: 2021-08-26T08:48:52.000Z { tz: 'Etc/UTC' },
//       description: 'Public holiday',
//       lastmodified: 2021-08-26T08:48:52.000Z { tz: 'Etc/UTC' },
//       sequence: '0',
//       status: 'CONFIRMED',
//       summary: 'Waitangi Day',
//       transparency: 'TRANSPARENT',
//       method: 'PUBLISH'
//   },
//
const findRelevantEvents = (
  calendarResponse: CalendarResponse,
  date: Date
): MyEvent[] => {
  return Object.values(calendarResponse)
    .filter((rawEvent): rawEvent is VEvent => {
      return (
        isVEvent(rawEvent) && toDateStamp(rawEvent.start) === toDateStamp(date)
      );
    })
    .map(vEvent => {
      return {
        start: vEvent.start,
        description: `${vEvent.description} (${vEvent.summary})`
      };
    });
};

const isVEvent = (item: CalendarComponent): item is VEvent => {
  return item.type === 'VEVENT';
};

interface MyEvent {
  start: DateWithTimeZone;
  description: string;
}

const getCalendarData = async (
  filePathOrUrl: string
): Promise<CalendarResponse> => {
  if (filePathOrUrl.startsWith('http')) {
    return ical.fromURL(filePathOrUrl);
  }

  return ical.parseFile(filePathOrUrl);
};

export async function generateDailyReport(
  notifier: Notifier,
  {
    date = new Date(),
    nzCalendarUrl = NZ_CALENDAR_URL,
    auCalendarUrl = AU_CALENDAR_URL
  } = {}
): Promise<void> {
  const nzPublicHolidays = await getCalendarData(nzCalendarUrl);
  const auPublicHolidays = await getCalendarData(auCalendarUrl);
  const nzEvents = findRelevantEvents(nzPublicHolidays, date);
  const auEvents = findRelevantEvents(auPublicHolidays, date);

  if (nzEvents.length || auEvents.length) {
    notifier.bufferMessage(`*Public holidays:*`, 'section');
  }

  for (const nzEvent of nzEvents) {
    notifier.bufferMessage(
      `:flag-nz: New Zealand: ${nzEvent.description}`,
      'section'
    );
  }

  for (const auEvent of auEvents) {
    notifier.bufferMessage(
      `:flag-au: Australia: ${auEvent.description}`,
      'section'
    );
  }
}
