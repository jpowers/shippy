const models = require('../models');

module.exports = (platform) => {
  var middleware = {};

  middleware.receive = (bot, message, next) => {
    // load internal user data and add it to the message
    // User
    models.user.findOrCreate({ where: { platformId: message.user, platform: platform.name } })
      .spread((user, created) => {
          // amend the message with a new field.
          // this will now be available inside the normal handler function
          //console.log('USER ', user);
          message.internal_user = user;
          message.new_user = created;
          // call next or else execution will stall
          next();
      })
      .catch(error => console.log(error));
  };
  return middleware;
};
