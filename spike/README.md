Notes on a potential feature where we sync Projectworks leave with a Google calendar

## Auth with google WIP

1. Create a user in your google workspace.
1. Lock it down as much as you can e.g. place it in an Organisational Unit which will allow you to remove access to any google services except calendar.
1. On your local dev machine run the TODO script. When it pops open a browser to authenticate, ensure you authenticating it against the google account of the bot user. The script will generate a `token.json` file. It is very important that you authenticated it against your locked down bot account, not your own account lest this app make changes to your google calendar.
  * The token contains a refresh token so it will continue to work long term
  * The token gives the app access to whatever scopes it requested in whatever google account you authenticated it with.
1. Copy the contents of `token.json` into the TODO environment variable in your AWS lambda.

Aside: We are not using a Google _Service Accounts_  because they require _delegated domain authority_ to be able to access Calendars in Google Workspace. This authority allows the app to impersonate any user in your Workspace which is much too scary for a bot like this.
