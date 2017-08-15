var Botkit = require('botkit');
var os = require('os');
const ep = require('../../lib/easy-post');

var controller = Botkit.twiliosmsbot({
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_number: process.env.TWILIO_NUMBER,
    debug: true
});

let bot = controller.spawn({});

controller.setupWebserver(process.env.PORT, function (err, webserver) {
  webserver.get('/', function(req, res) {
        res.send('ShippyBot :)');
    });
  controller.createWebhookEndpoints(controller.webserver, bot, function () {
    console.log('TwilioSMSBot is online!');
  });
});

//include base controller
require('../skills/create-shipment')(controller);

