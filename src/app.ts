import * as hapi from 'hapi';
import * as boom from 'boom';

var server = new hapi.Server();
var port = process.env.ORT || 3000;

server.connection({ port: port });

server.route({
    method: 'GET',
    path: '/',
    handler: (requews, reply) => {
        reply(boom.notImplemented());
    }
});

server.register({
    register: require('good'),
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        server.start(function () {
            console.info('Server started at ' + server.info.uri);
        });
    }
});

export = server;