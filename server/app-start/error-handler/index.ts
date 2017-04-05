// libs
import * as hapi from 'hapi';

import logger from '../../shared/logger';

function errorHandler(request: hapi.Request, reply: hapi.IReply) {
    if (request.response.isBoom) {
        let response = <hapi.Response & hapi.IBoom>request.response;
        let statusCode = response.output.statusCode;
        if (statusCode === 404 || statusCode === 500) {
            let template: string = statusCode.toString();
            let title = response.output.payload.error;
            let message = response.stack;
            let output = { title, message, statusCode };
            logger.error('Page Not Found', { url: request.url.href, statusCode });
            reply.view(template, output).code(statusCode);
            return;
        }
    }
    reply.continue();
}

export function register(server: hapi.Server, options, next) {
    
    server.ext('onPreResponse', errorHandler);

    next();
}

register['attributes'] = {
    pkg: {name: 'hapi-error-handler'}
};