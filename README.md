# projectworks leave notifications

Serverless functions that post a daily and weekly summaries of useful
information into Slack.

Features:

- Collects and collates approved [ProjectWorks](https://projectworks.io/) .leave
  requests for each day and week (separate lambda functions), decorates the
  leave request with user information from the ProjectWorks Users API and posts
  the data as a Slack message.
- Scrapes public holiday data from AU & NZ and posts reminders about upcoming
  public holidays to Slack
- Posts reminders about DST changes between New Zealand and Australia
  (specifically AEST which covers Melbourne and Sydney)

The tasks are scheduled with cron expressions that you can adjust within
serverless.yml.

### Getting started

```bash
npm install

cp .env.staging.example .env.staging
cp .env.prod.example .env.production
# now edit the files to have the appropriate secret values

# run local code in staging env (see serverless docs for details)
serverless invoke local --function weeklyReport -s staging
serverless invoke local --function dailyReport -s staging

npm run format # check formatting with prettier
npm run format:fix # fix formatting with prettier

npm run lint # TS linting with eslint
npm run lint:fix # fix TS linting with eslint

npm test # run tests with Jest
```

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

```bash
npm deploy:staging
npm deploy:production
```

### Contributing

Contributions are welcome. Please see the
[contribution guidelines](https://github.com/ackama/projectworks-leave-notifications/blob/main/CONTRIBUTING.md)
for detailed instructions.

## About Ackama

These functions are created and maintained by
[Ackama Group](https://www.ackama.com) using our investment time scheme. We are
passionate about using and contributing back to the open source community, and
are available for hire.
