const Botkit = require('botkit');

const controller = Botkit.consolebot({
  json_file_store: './data',
  debug: true
});
const bot = controller.spawn();

require('../skills/create-shipment')(controller);
