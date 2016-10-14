// libs
import * as hapi from 'hapi';

function errorHandler(request, reply) {
    if (request.response.variety === 'view') {
        const context = request.response.source.context;
    }
    if (request.response.isBoom) {
        let response: hapi.IBoom = <any>request.response;
        let code = response.output.statusCode;
        if (code === 404 || code === 500) {
            let template: any = code.toString();
            let title = response.output.payload.error;
            let message = response.stack;
            return reply.view(template, { title: title, message: message, statusCode: code }).code(code);
        }
    }

    return reply.continue();
}

export function register(server: hapi.Server, options, next) {
    
    server.ext('onPreResponse', errorHandler);

    next();
}

register['attributes'] = {
    pkg: {name: 'hapi-error-handler'}
};