var Botkit = require('botkit');
var os = require('os');
const ep = require('../../lib/easy-post.js');

var controller = Botkit.twiliosmsbot({
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_number: process.env.TWILIO_NUMBER,
    debug: true
});

var apiai = require('botkit-middleware-apiai')({
    token: process.env.API_AI_TOKEN,
    skip_bot: false // or false. If true, the middleware don't send the bot reply/says to api.ai
});

controller.middleware.receive.use(apiai.receive);

let bot = controller.spawn({});

controller.setupWebserver(process.env.PORT, function (err, webserver) {
  webserver.get('/', function(req, res) {
        res.send('ShippyBot :)');
    });
  controller.createWebhookEndpoints(controller.webserver, bot, function () {
    console.log('TwilioSMSBot is online!');
  });
});

// apiai.hears for intents. in this example is 'hello' the intent
controller.hears('createQuote', 'message_received', apiai.hears, (bot, message) => {
  console.log("Message: ", message.fulfillment);
  //next message message.fulfillment.speech
  bot.startConversation(message, askLocationTo);

});

const askLocationTo = (response, convoTo) => {
  convoTo.ask("Where are you shiping the package to?", (response, convoTo) => {
    // validate address
    checkAddress('locationTo', response, convoTo).then(() => {
      console.log('Res from checkAdress To');
      convoTo.next();
    });
  });
}

const askLocationFrom = (response, convoFrom) => {
  convoFrom.ask("Where are you sending the package from?", (response, convoFrom) => {
    // validate address
    checkAddress('locationFrom', response, convoFrom).then(() => {
      console.log('Res from checkAdress From');
      convoFrom.next();
    });
  });
};

const askWeight = (response, convo) => {
  convo.ask("How much does the package weigh in pounds?", (response, convo) => {
    convo.setVar('weight', parseInt(response.text));
    ep.processQuote(convo.vars.locationTo, convo.vars.locationFrom, convo.vars.weight).then((shipment) => {
      //console.log(shipment);
      convo.say(`Here is a quote ${shipment.rates[0].service} : \$${shipment.rates[0].list_rate}`);
      convo.next();
    }).catch(error => console.log('Quote error: ', error));
  });
};

const checkAddress = (type, response, convo) => {
  //console.log(convo);
  return ep.validateAddress(response.text).then((result) => {
    console.log('VALID: ', result.exact.length);
    if (result.exact.length == 0) {
      convo.say("That doesn't appear to be a valid address. Please try again.");
      convo.repeat();
      convo.next();
    } else if (result.exact.length > 1) {
      convo.say("I found multiple address matches... Please copy and paste a suggestion or type a new address.");
      convo.say(result.exact.join("\n"));
      convo.repeat();
      convo.next();
    } else {
      //convo.locationFrom = result.exact[0];
      convo.setVar(type, result.exact[0]);
      if (type == 'locationTo') {
        askLocationFrom(response, convo);
      } else {
        askWeight(response, convo);
      }
    }
  }).catch(error => {
    console.log(`Address validation error: ${error}`); 
    convo.say("That doesn't appear to be a valid address. Please try again.");
    convo.repeat();
    convo.next();
  });
};

//controller.hears('.*', 'message_received', (bot, message) => {
  //bot.reply(message, 'huh?')
//})
