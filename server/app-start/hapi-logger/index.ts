// libs
import * as hapi from 'hapi';
require('good-winston'); // do this before using a winston reporter

// app
import logger from '../../shared/logger';

export function register(server: hapi.Server, options, next) {
    server.register({
        register: require('good'),
        options: {
            reporters: {
                winston: [{
                    module: 'good-winston',
                    args: [logger, {
                        error_level: 'error',
                        ops_level: 'debug',
                        request_level: 'debug',
                        response_level: 'info',
                        other_level: 'info'
                    }]
                }]
            }
        }
    });
    next();
};

register['attributes'] = {
    pkg: { name: 'logger' }
};