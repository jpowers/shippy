// modules =================================================
var dotenv         = require('dotenv');

// configuration ===========================================

//load environment variables,
//either from .env files (development),
//heroku environment in production, etc...
dotenv.load();

//botkit (apres port)
if (process.env.NODE_ENV === 'development') {
  require('./app/controllers/console')
} else {
  require('./app/controllers/twilio-sms')
}
