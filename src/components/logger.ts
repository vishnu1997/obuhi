import winston from 'winston';

const logLocation: string = `${__dirname}/../../logs/`;
const logFilename: string = 'combined.log';

const options: winston.LoggerOptions = {
    exitOnError: false,
    transports: [
        new winston.transports.File({
            filename: logLocation + logFilename,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'DD-MM-YYYY HH:mm:ss'
                }),
                winston.format.printf(
                    (msg) => `${msg.timestamp} || ${msg.level.toString().toUpperCase()}: ${
                        msg.message
                    }`
                )
            )
        })
    ]
};

const logger = winston.createLogger(options);

const consoleTransportInstance = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        winston.format.colorize(),
        winston.format.printf(
            (msg) => `${msg.timestamp} || ${msg.level}: ${msg.message}`
        )
    )
});
logger.add(consoleTransportInstance);


export default class LoggerService {
    module: string;

    constructor(module: string) {
        this.module = module;
    }

    info(message) {
        if (typeof message === 'object') {
            logger.info(`${this.module} - ${JSON.stringify(message, null, 2)}`);
        } else {
            logger.info(`${this.module} - ${message}`);
        }
    }

    warn(message) {
        if (typeof message === 'object') {
            logger.warn(`${this.module} - ${JSON.stringify(message, null, 2)}`);
        } else {
            logger.warn(`${this.module} - ${message}`);
        }
    }

    debug(message) {
        if (typeof message === 'object') {
            logger.debug(`${this.module} - ${JSON.stringify(message, null, 2)}`);
        } else {
            logger.debug(`${this.module} - ${message}`);
        }
    }

    error(message) {
        if (typeof message === 'object') {
            logger.error(`${this.module} - ${JSON.stringify(message, null, 2)}`);
        } else {
            logger.error(`${this.module} - ${message}`);
        }
    }
}
