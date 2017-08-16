const Botkit = require('botkit');
const logger = require('../../util/logger')({ __filename });

const controller = Botkit.twiliosmsbot({
  account_sid: process.env.TWILIO_ACCOUNT_SID,
  auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_number: process.env.TWILIO_NUMBER,
  debug: true
});

const bot = controller.spawn({});

controller.setupWebserver(process.env.PORT, (err, webserver) => {
  webserver.get('/', (req, res) => {
    res.send('ShippyBot :)');
  });
  controller.createWebhookEndpoints(controller.webserver, bot, () => {
    logger.debug('TwilioSMSBot is online!');
  });
});

// include base controller
require('../skills/create-shipment')(controller);

