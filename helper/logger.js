const appRoot = require('app-root-path');
const winston = require('winston');

let transports = [];
let transportFile = new winston.transports.File({
  level: 'info',
  filename: `${appRoot}/logs/app.log`,
  handleExceptions: true,
  json: true,
  maxsize: 1000 * 1024, //1MB
  maxFiles: 20,
  colorize: false
});

let transportConsole = new winston.transports.Console({
  level: 'debug',
  handleExceptions: true,
  json: false,
  colorize: true,
  timestamp : true
});

transports.push(transportFile);
transports.push(transportConsole);

let logger = winston.createLogger({
  transports: transports,
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message.slice(0, -1));
  }
};