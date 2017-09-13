const ep = require('../../lib/easy-post');
const GoogleUrl = require( 'google-url' );
const apiai = require('botkit-middleware-apiai')({
  token: process.env.API_AI_TOKEN,
  skip_bot: false // or false. If true, the middleware don't send the bot reply/says to api.ai
});
const formatService = require('../../lib/format-quote');

const googleUrl = new GoogleUrl({ key: process.env.GOOGLE_API_TOKEN });

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
    //require('./create-shipment')(bot, message);

    
  });

  controller.hears('help', 'message_received', (bot, message) => {
    bot.reply(message, 'Hello, do you need a shipping label?'); 
  });

  const askLocationTo = (response, convoTo) => {
    convoTo.ask("Where are you shipping the package to (e.g. 123 main st boston ma)?", (response, convoTo) => {
      // validate address
      checkAddress('locationTo', response, convoTo).then(() => {
        console.log('Res from checkAdress To');
        convoTo.next();
      });
    });
  };

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
      askSenderInfo(response, convo);
      convo.next();
      //ep.processQuote(convo.vars.locationTo, convo.vars.locationFrom, convo.vars.weight).then((shipment) => {
        ////console.log(shipment);
        //const rates = formatService.availibleRates(shipment.rates);
        //convo.say("Here are some shipping services. \n" + rates.map(r => r.formated).join('\n'));
        //console.log("Services ", rates.map(r => r.formated));
        //createShipment(response, convo, shipment, rates);
        //convo.next();
      //}).catch(error => console.log('Quote error: ', error));
    });
  };

  const askSenderInfo = (response, convo) => {
    convo.ask('Who are you sending the shipment to? (e.g. John Smith or Acme Inc.)', (response, convo) => {
      convo.setVar('toName', response.text);
      convo.next();
    });
    convo.ask('What\'s their contact phone number?', (response, convo) => {
      convo.setVar('toPhone', response.text);
      const locationTo = Object.assign({name: convo.vars.toName, phone: convo.vars.toPhone}, convo.vars.locationTo);
      ep.processQuote(locationTo, convo.vars.locationFrom, convo.vars.weight).then((shipment) => {
        //console.log(shipment);
        convo.next();
        const rates = formatService.availibleRates(shipment.rates);
        convo.say("Here are some shipping services. \n" + rates.map(r => r.formated).join('\n'));
        console.log("Services ", rates.map(r => r.formated));
        createShipment(response, convo, shipment, rates);
        convo.next();
      }).catch(error => console.log('Quote error: ', error));
    });
    convo.next();

  };

  const createShipment = (response, convo, shipment, rates) => {
    let serviceIndex, rateId;
    convo.ask(`Reply with the number of the service you'd like to buy (e.g. 1 for ${rates[0].service})`, (response, convo) => {
      serviceIndex = response.text;
      //console.log("Convo Rates", rates);
      //console.log("Index ", serviceIndex);
      rateId = rates[parseInt(serviceIndex - 1)].id;
      //console.log(shipment);
      ep.buyLabel(shipment.id, rateId)
      .then((shipment => {
        return new Promise((resolve, reject) => {
          googleUrl.shorten(shipment.postage_label.label_url, function( err, shortUrl ) {
          // shouldrtUrl should be http://goo.gl/BzpZ54 
            if (err) {
              reject(err);
            } else {
              resolve(shortUrl);
            }
          });
        });
      }))
      .then((url) => {
        convo.say({text: 'Thanks! Here is a link to your label.', mediaUrl: url, medaUrl: url});
        convo.next();
      })
      .catch(error => console.log('Quote error: ', error));
    });
    convo.next();
    //ep.updateAddress(shipment.to_address.id, shipToName, shipToPhone)
      //.then(ep.buyLabel(shipment.id, rateId))
      //.then((label) => {
        //console.log(label); 
      //}).catch(error => console.log('Quote error: ', error));
    //convo.gotoThread('create_shipment');
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
}
