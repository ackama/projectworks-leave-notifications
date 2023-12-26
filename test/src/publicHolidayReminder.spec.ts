import { DateTime } from 'luxon';
import { Notifier } from '../../src/adapters/notifier';
import { generateDailyReport } from '../../src/reminders/publicHolidayReminder';

jest.mock('../../src/adapters/notifier');

describe('generateDailyReport', () => {
  const nzFixtureCalendarPath = './test/fixtures/nz-public-holiday-dates.ics';
  const auFixtureCalendarPath =
    './test/fixtures/au-victorian-public-holiday-dates.ics';

  it('buffers expected messages a holiday in both NZ and AU (Christmas day)', async () => {
    const xmasDay = DateTime.fromISO('2023-12-25', {
      zone: 'Pacific/Auckland'
    }).toJSDate();
    const mockNotifier = new Notifier();

    await generateDailyReport(mockNotifier, {
      date: xmasDay,
      nzCalendarUrl: nzFixtureCalendarPath,
      auCalendarUrl: auFixtureCalendarPath
    });

    expect(mockNotifier.bufferMessage).toMatchInlineSnapshot(`
    [MockFunction] {
      "calls": [
        [
          "*Public holidays:*",
          "section",
        ],
        [
          ":flag-nz: New Zealand: Public holiday (Christmas Day)",
          "section",
        ],
        [
          ":flag-au: Australia: Restricted trading day - only exempt shops are permitted to open (Christmas Day)",
          "section",
        ],
      ],
      "results": [
        {
          "type": "return",
          "value": undefined,
        },
        {
          "type": "return",
          "value": undefined,
        },
        {
          "type": "return",
          "value": undefined,
        },
      ],
    }
    `);
  });

  it('buffers expected messages a holiday in NZ only', async () => {
    const waitangiDay = DateTime.fromISO('2023-02-06', {
      zone: 'Pacific/Auckland'
    }).toJSDate();
    const mockNotifier = new Notifier();

    await generateDailyReport(mockNotifier, {
      date: waitangiDay,
      nzCalendarUrl: nzFixtureCalendarPath,
      auCalendarUrl: auFixtureCalendarPath
    });

    expect(mockNotifier.bufferMessage).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": [
          [
            "*Public holidays:*",
            "section",
          ],
          [
            ":flag-nz: New Zealand: Public holiday (Waitangi Day)",
            "section",
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
  });

  it('buffers expected messages a holiday in AU only', async () => {
    const melbourneCupDay = DateTime.fromISO('2023-11-07', {
      zone: 'Pacific/Auckland'
    }).toJSDate();
    const mockNotifier = new Notifier();

    await generateDailyReport(mockNotifier, {
      date: melbourneCupDay,
      nzCalendarUrl: nzFixtureCalendarPath,
      auCalendarUrl: auFixtureCalendarPath
    });

    expect(mockNotifier.bufferMessage).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": [
          [
            "*Public holidays:*",
            "section",
          ],
          [
            ":flag-au: Australia: Melbourne Cup Day is a public holiday across all of Victoria unless alternate local holiday has been arranged by non-metro council (Melbourne Cup)",
            "section",
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
  });
});
