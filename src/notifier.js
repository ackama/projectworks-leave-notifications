// @ts-nocheck

const { IncomingWebhook } = require('@slack/webhook');

class Notifier {
  constructor(url = process.env.SLACK_WEBHOOK_URL) {
    if (typeof url !== 'string') {
      throw new Error('Missing SLACK_WEBHOOK_URL from environment');
    }
    this.slackWebhook = new IncomingWebhook(url);
    this.blocksBuffer = [];
  }

  /**
   * Store the given message in the buffer for later sending. We also log it so
   * we have a record of it in case something happens which prevents the send.
   *
   * @param message The line to store in the buffer
   * @param style The formatting style to use for the given block
   */
  bufferMessage(message, style) {
    let block = {};

    console.log(message, { style });

    // The Slack docs are pretty crap about rich_text but some info is in
    // https://api.slack.com/changelog/2019-09-what-they-see-is-what-you-get-and-more-and-less
    switch (style) {
      case 'bullet':
        block = {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_list',
              style: 'bullet',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [
                    {
                      type: 'text', // Slack doesn't allow Markdown in bullet lists
                      text: message
                    }
                  ]
                }
              ]
            }
          ]
        };
        break;
      case 'header':
        block = {
          type: 'header',
          text: {
            type: 'plain_text',
            text: message,
            emoji: true
          }
        };
        break;
      case 'section':
        block = {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        };
        break;

      default:
        console.error(`Unrecognised style: ${style}`);
        block = {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:warning: Unrecognised style ${style}`
          }
        };
        break;
    }

    this.blocksBuffer.push(block);
  }

  /**
   * Send buffered messages and immediately empty the buffer
   */
  async sendBufferedMessages() {
    try {
      const payload = { blocks: this.blocksBuffer };

      // Debugging Slack formatting is tricky but you can paste the JSON into
      // the Slack Block builder and it will give you much better error messages:
      //
      //   https://app.slack.com/block-kit-builder/
      //
      // console.log(JSON.stringify(payload));

      await this.slackWebhook.send(payload);

      // empty the buffer now that we have successfully sent its contents to Slack
      this.blocksBuffer = [];
    } catch (e) {
      console.error('Error sending to slack webhook:', e);

      return { success: false, message: 'Failed to send to Slack Webhook' };
    }

    return { success: true, message: 'OK' };
  }

  async send(payload) {
    try {
      await this.slackWebhook.send(payload);
    } catch (e) {
      console.error('Error sending to slack webhook:', e);

      return { success: false, message: 'Failed to send to Slack Webhook' };
    }

    return { success: true, message: 'OK' };
  }
}

module.exports.Notifier = Notifier;
