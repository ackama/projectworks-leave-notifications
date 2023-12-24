import { WebClient } from '@slack/web-api';
import * as contentful from 'contentful';
import { DateTime } from 'luxon';
import { Notifier } from './notifier';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTENTFUL_SPACE_ID: string;
      CONTENTFUL_API_KEY: string;
      SLACK_API_TOKEN: string;
    }
  }
}

interface ContentfulStaffMember {
  name: string;
  slackHandle: string;
  bornOn: string;
  startedOn: string;
  birthdayNotificationEnabled: boolean;
  workAnniversaryNotificationEnabled: boolean;
}

interface Member {
  id?: string;
  real_name?: string;
  profile: {
    display_name?: string;
  };
}

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_API_KEY = process.env.CONTENTFUL_API_KEY;
const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN;

// Slack has no API to lookup a single user by name so we have to get all
// users via `cacheSlackUsers` below. This is an expensive operation both in
// latency and also Slack rate-limits it so we cache the results here.
let allSlackUsers: Member[] = [];

const cacheSlackUsers = async (): Promise<void> => {
  if (allSlackUsers.length > 0) {
    return;
  }

  const client = new WebClient(SLACK_API_TOKEN, {
    retryConfig: { retries: 0 }
  });

  try {
    // Docs: https://api.slack.com/methods/users.list
    const response = await client.users.list();

    allSlackUsers = response.members as Member[];
  } catch (error: unknown) {
    console.log('Failed to get list of users from Slack. Error:', error);
  }
};

const getNameFromSlack = (slackHandle: string): string => {
  // user.profile.display_name is what you seen in slack as the user's slack
  // name e.g. `user.profile.display_name === 'Riker'` means you see `@Riker` in
  // Slack.
  const user = allSlackUsers.find(u => u.profile.display_name === slackHandle);

  return `${user?.real_name} <@${user?.id}>`;
};

const hasUpcomingWorkAnniversary = (person: ContentfulStaffMember) => {
  return (
    person.workAnniversaryNotificationEnabled &&
    yearlyAnniversaryIsCloseEnoughToToday(person.startedOn)
  );
};

const numYearsAgo = (dateStr: string): number => {
  const now = DateTime.now().year;
  const then = DateTime.fromISO(dateStr).year;

  return now - then;
};

const prettyDate = (dateStr: string): string => {
  return DateTime.fromISO(dateStr).toFormat('d LLLL');
};

const buildWorkAnniversaryMessage = (person: ContentfulStaffMember): string => {
  const tenure = numYearsAgo(person.startedOn);
  const name = getNameFromSlack(person.slackHandle);
  const date = prettyDate(person.startedOn);
  const message = `:tada: Congratulations ${name} - as of ${date}, you will have worked at Ackama for ${tenure} years! :tada:`;

  return message;
};

const buildBirthdayMessage = (person: ContentfulStaffMember): string => {
  const age = numYearsAgo(person.bornOn);
  const name = getNameFromSlack(person.slackHandle);
  const date = prettyDate(person.bornOn);
  const message = `:birthday: Happy birthday to ${name} who is turning ${age} on ${date}! :birthday:`;

  return message;
};

// Is the yearly anniversary of the given date happening today or one of the
// next two days (if today is Friday).
const yearlyAnniversaryIsCloseEnoughToToday = (dateStr: string): boolean => {
  // Use NZ timezone. Melbourne is only 2hrs behind so this should give the
  // correct date there too.
  const todayInNZ = DateTime.local().setZone('Pacific/Auckland');

  const daysOfInterest = [todayInNZ.toFormat('MM-dd')]; // always check today

  // if today is Friday then we check the upcoming weekend days too
  if (todayInNZ.weekdayShort === 'Fri') {
    daysOfInterest.concat(todayInNZ.plus({ days: 1 }).toFormat('MM-dd')); // Saturday
    daysOfInterest.concat(todayInNZ.plus({ days: 2 }).toFormat('MM-dd')); // Sunday
  }

  const query = dateStr.replace(/^\d{4}-/u, '');

  // check if today is a day of interest
  if (!daysOfInterest.includes(query)) {
    return false;
  }

  return true;
};

const hasUpcomingBirthday = (person: ContentfulStaffMember) => {
  return (
    person.birthdayNotificationEnabled &&
    yearlyAnniversaryIsCloseEnoughToToday(person.bornOn)
  );
};

const fetchStaffMembersFromContentful = async (): Promise<
  ContentfulStaffMember[]
> => {
  const client = contentful.createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_API_KEY
  });
  const staffMemberEntries = await client.getEntries({
    content_type: 'staffMember'
  });

  return staffMemberEntries.items.map(
    entry => entry.fields as unknown as ContentfulStaffMember
  );
};

const sendBirthdayNotifications = (
  staffMembers: ContentfulStaffMember[],
  notifier: Notifier
): void => {
  staffMembers.filter(hasUpcomingBirthday).forEach(staffMember => {
    const msg = buildBirthdayMessage(staffMember);

    notifier.bufferMessage(msg, 'section');
  });
};

const sendWorkAnniversaryNotifications = (
  staffMembers: ContentfulStaffMember[],
  notifier: Notifier
): void => {
  staffMembers.filter(hasUpcomingWorkAnniversary).forEach(staffMember => {
    const msg = buildWorkAnniversaryMessage(staffMember);

    notifier.bufferMessage(msg, 'section');
  });
};

export async function generateDailyReport(notifier: Notifier): Promise<void> {
  await cacheSlackUsers();

  const staffMembers = await fetchStaffMembersFromContentful();

  sendBirthdayNotifications(staffMembers, notifier);
  sendWorkAnniversaryNotifications(staffMembers, notifier);
}
