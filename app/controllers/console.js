const Botkit = require('botkit');

const controller = Botkit.consolebot({
  json_file_store: './data',
  debug: true,
  stats_optout: true
});
controller.spawn();
require('../skills/create-quote')(controller);
