// modules =================================================
var dotenv         = require('dotenv');

// configuration ===========================================

//load environment variables,
//either from .env files (development),
//heroku environment in production, etc...
dotenv.load();

//botkit (apres port)
require('./app/controllers/twilio-sms')


