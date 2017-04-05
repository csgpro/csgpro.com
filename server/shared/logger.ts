import * as winston from 'winston';
import * as path from 'path';
require('winston-daily-rotate-file');

export default new winston.Logger({
    transports: [
        new winston.transports.DailyRotateFile({
            name: 'info-file',
            filename: './logs/info.log',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            level: 'info',
            handleExceptions: true
        }),
        new winston.transports.DailyRotateFile({
            name: 'error-file',
            filename: './logs/error.log',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            level: 'error',
            handleExceptions: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});