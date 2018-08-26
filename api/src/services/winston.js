const winston = require('winston');
const Logger = winston.Logger;
const Console = winston.transports.Console;

const logger = new Logger({
  level: 'info',
  transports: [
    new Console()
  ]
});

module.exports = logger;