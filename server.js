// modules =================================================
// load environment variables,
// either from .env files (development),
// heroku environment in production, etc...
require('dotenv').load();

// configuration ===========================================


// botkit (apres port)
if (process.env.NODE_ENV === 'development') {
  require('./app/controllers/console');
} else {
  require('./app/controllers/twilio-sms');
}
