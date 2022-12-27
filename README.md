# projectworks-leave-notifications

Serverless functions that post a weekly and/or daily summary of leave record in
ProjectWorks into Slack

- [x] Collects and collates weekly leave requests
- [x] Collects and collates daily leave requests
- [x] Sideloads user information
- [x] Filters to approved leave requests only
- [x] Posts to Slack via webhook
- [x] Run at a fixed time daily and weekly
- [ ] Has some kind of tests
- [x] CI
- [ ] CD

### Getting started

- `npm installl`
- `cp .env.example.production .env.development`, and fill in the missing details
- `serverless invoke local --function weeklyReport` <- Weekly summary
- `serverless invoke local --function dailyReport` <- Today's summary
- `npm run lint` <- Check code style
- `npm run test` <- Run tests

### Configuration

Environment variables of note:

- `TZ` - configures the timezone. This is necessary for dates and times to be
  shown correctly. Example: `Pacific/Auckland`
- `PROJECTWORKS_USERNAME` - the basic auth username for accessing the
  ProjectWorks API. This is _not_ your personal Projectworks account username.
- `PROJECTWORKS_PASSWORD` - the basic auth password for accessing the
  ProjectWorks API. This is _also_ not your personal Projectworks account
  password.
- `SLACK_WEBHOOK_URL` - the webhook URL to post messages to. Must be configured
  to run, even locally.

Constants that you might want to change (`handler.js`):

- `PW_URL` - you _probably_ don't need to change this unless you have a CNAME,
  proxy, or something else that changes the projectworks host to connect to.
- `LOCALE` - hints to date functions where in the world you are
- `APPROVED_LEAVE_STATUS` - the ID number of the leave status that means
  "approved". It's not clear how customer-specific these are, YMMV. You can view
  your own organisation's leave status names and IDs using
  `curl -X GET --header 'Accept: application/json' 'https://api.projectworksapp.com/api/v1.0/Leaves/Statuses'`
  with your basic auth creds from above.
- `WEEK_STARTS_ON` - what day your week starts, zero-indexed from Sunday. This
  can be whatever day you want, and defaults to Monday. Controls what a 'week'
  is when we're summarising leave requests.

### Deployment

`serverless deploy` will provision the necessary infrastructure to run these
scripts. AWS Lambda is assumed, but there aren't any external service
dependencies, so this would quite easily support multiple clouds.

The tasks are scheduled with cron expressions that you can adjust within
serverless.yml.

### Contributing

Contributions are welcome. Please see the
[contribution guidelines](https://github.com/ackama/projectworks-leave-notifications/blob/main/CONTRIBUTING.md)
for detailed instructions.

## About Ackama

These functions are created and maintained by
[Ackama Group](https://www.ackama.com) using our investment time scheme. We are
passionate about using and contributing back to the open source community, and
are available for hire.
