const { IncomingWebhook } = require('@slack/webhook');

class Notifier {
  constructor(url = process.env.SLACK_WEBHOOK_URL) {
    if (typeof url !== 'string') {
      throw new Error('Missing SLACK_WEBHOOK_URL from environment');
    }
    this.slackWebhook = new IncomingWebhook(url);
    this.outputLinesBuffer = [];
  }

  /**
   * Store the given message in the buffer for later sending. We also log it so
   * we have a record of it in case something happens which prevents the send.
   *
   * @param message The line to store in the buffer
   */
  bufferMessage(message) {
    console.log(message);
    this.outputLinesBuffer.push(message);
  }

  /**
   * Send buffered messages and immediately empty the buffer
   */
  async sendBufferedMessages() {
    const output = this.outputLinesBuffer.join('\n');

    try {
      await this.slackWebhook.send({ text: output });

      // empty the buffer now that we have successfully sent its contents to Slack
      this.outputLinesBuffer = [];
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
