const ep = require('../../lib/easy-post.js');
const apiai = require('botkit-middleware-apiai')({
  token: process.env.API_AI_TOKEN,
  skip_bot: false // or false. If true, the middleware don't send the bot reply/says to api.ai
});
const formatQuote = require('../../lib/format-quote');

module.exports = (controller) => {

  controller.middleware.receive.use(apiai.receive);
  // apiai.hears for intents. in this example is 'hello' the intent
  controller.hears('createQuote', 'message_received', apiai.hears, (bot, message) => {
    //console.log("Message: ", message.fulfillment);
    //next message message.fulfillment.speech
    //console.log("Message: ", message);
    //console.log("Bot: ", bot);
    //Store user
    bot.startConversation(message, askLocationTo);
  });

  const askLocationTo = (response, convoTo) => {
    convoTo.ask("Where are you shipping the package to (e.g. 123 main st boston ma)?", (response, convoTo) => {
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
        convo.setVar('shipmentId', shipment.id);
        convo.setVar('rates', shipment.rates);
        convo.say("Here are some shipping services.");
        convo.say(formatQuote(shipment.rates).join('\n'));
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
}
