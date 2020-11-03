"use strict";

const dateFns = require("date-fns");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const PW_URL = "https://api.projectworksapp.com";
const PW_USERNAME = process.env.PROJECTWORKS_USERNAME;
const PW_PASSWORD = process.env.PROJECTWORKS_PASSWORD;
const LOCALE = "en-NZ";
const WEEK_STARTS_ON = 1; // Monday
const APPROVED_LEAVE_STATUS = 2; // curl -X GET --header 'Accept: application/json' 'https://api.projectworksapp.com/api/v1.0/Leaves/Statuses'

const utcWeekRange = (on = new Date()) => {
  const weekRangeOpts = { locale: LOCALE, weekStartsOn: WEEK_STARTS_ON };

  return [
    dateFns.startOfWeek(on, weekRangeOpts).toUTCString(),
    dateFns.endOfWeek(on, weekRangeOpts).toUTCString(),
  ];
};
const utcDayRange = (on = new Date()) => {
  const dayRangeOpts = { locale: LOCALE };

  return [
    dateFns.startOfDay(on, dayRangeOpts),
    dateFns.endOfDay(on, dayRangeOpts),
  ];
};

const apiGet = (path) => {
  const headers = new fetch.Headers();

  headers.append("Accept", "application/json");
  headers.append(
    "Authorization",
    `Basic ${Buffer.from(`${PW_USERNAME}:${PW_PASSWORD}`).toString("base64")}`
  );

  return fetch(`${PW_URL}${path}`, { headers });
};

const fetchUser = async (userId) =>
  apiGet(`/api/v1.0/Users/${userId}`).then((r) => r.json());

const leavesBetween = async (startDate, endDate) => {
  const params = new URLSearchParams({
    startDate,
    endDate,
    statusId: APPROVED_LEAVE_STATUS,
    pageSize: 1000,
  });
  const response = await apiGet(`/api/v1.0/Leaves?${params.toString()}`);
  const leaves = await response.json();

  let message = "";

  // Not using forEach here because it's not async/await aware.
  for (let index = 0; index < leaves.length; index++) {
    const leave = leaves[index];

    // ESLint would have us do this with a Promise.all() but procedurally we are
    // looking up the user to use for message building.
    // eslint-disable-next-line no-await-in-loop
    const user = await fetchUser(leave.UserID);
    const formattedDays = leave.Days.filter((d) =>
      dateFns.isWithinInterval(Date.parse(d.Date), {
        start: Date.parse(startDate),
        end: Date.parse(endDate),
      })
    )
      .map(
        (d) =>
          `${dateFns.format(Date.parse(d.Date), "EEEE d LLL")}, ${d.Hours} hrs`
      )
      .join(", ");

    message += `${user.FirstName} ${user.LastName}: ${formattedDays}\n`;
  }

  console.log(message);
};

module.exports.thisWeek = async (_event) => {
  const [startDate, endDate] = utcWeekRange();

  return leavesBetween(startDate, endDate);
};

module.exports.today = async (_event) => {
  const [startDate, endDate] = utcDayRange();

  leavesBetween(startDate, endDate);
};

module.exports.thisWeek();
module.exports.today();
