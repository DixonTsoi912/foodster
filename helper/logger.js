const appRoot = require('app-root-path');
const winston = require('winston');

exports.logger = function() {
    let options = {
        file: {
          level: 'info',
          filename: `${appRoot}/logs/app.log`,
          handleExceptions: true,
          json: true,
          maxsize: 5242880,
          maxFiles: 5,
          colorize: false,
        },
        console: {
          level: 'debug',
          handleExceptions: true,
          json: false,
          colorize: true,
        },
      };

    let logger = new winston.Logger({
        transports: [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console)
        ],
        exitOnError: false,
    });

    logger.stream = {
        write: function(message, encoding) {
            logger.info(message);
        },
    };
};