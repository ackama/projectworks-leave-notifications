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
