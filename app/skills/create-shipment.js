module.exports = (controller) => {
  controller.hears('thank', 'direct_message', (bot, message) => {
    bot.reply(message, 'You\'re welcome!');
  });

  controller.hears(['hello', 'hi', 'hey', 'yo', 'what\'s up?'], 'direct_message', (bot, message) => {
    models.user.getBySlackId(message.user).then((user) => {
      bot.startConversation(message, (err, initialConvo) => {
        initialConvo.ask(user ? `Hi ${user.data.profile.first_name}, how are you today?` : 'Hello, how are you today?', [
          {
            pattern: /(how are you)/i,
            callback(response, convo) {
              convo.say('I\'m doing great! Thanks for asking.');
              convo.next();
            }
          },
          {
            pattern: /(not good|bad|awful|not great|terrible|horrible)/i,
            callback(response, convo) {
              convo.say('Sorry to hear that.');
              convo.next();
            }
          },
          {
            pattern: /(good|great|awesome|ok|excellent|spectacular|super)/i,
            callback(response, convo) {
              convo.say('Glad to hear it!');
              convo.next();
            }
          },
          {
            default: true,
            callback(response, convo) {
              convo.say('I\'m sorry, I didn\'t get that.');
              // convo.repeat();
              convo.next();
            }
          }
        ]);
      });
    });
  });
}
