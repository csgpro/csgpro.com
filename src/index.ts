'use strict';

import * as conf from 'nconf';

// Load environment variables
conf.env().file({ file: __dirname + '/../settings.json' });

import * as hapi from 'hapi';
import * as path from 'path';
import * as routes from './routes';
import * as sitemap from './modules/sitemap';
import database from './database';
import * as hapiSitemap from './modules/hapi-sitemap';
const handlebars = require('handlebars');
const paginate = require('handlebars-paginate');

const AUTH_TOKEN_SECRET: string = conf.get('AUTH_TOKEN_SECRET');

handlebars.registerHelper('paginate', paginate);

const server = new hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        },
        router: {
            isCaseSensitive: true,
            stripTrailingSlash: true
        }
    }
});

const defaultContext = {
    sitename: 'CSG Pro'
}

database(server);

const port = process.env.PORT || 3000;

server.connection({ port: port, host: process.env.HOST });

server.register([require('hapi-auth-jwt2')], (err) => {
    if (err) {
        console.error('Failed to load plugin: ', err);
    }
});

server.auth.strategy('jwt', 'jwt', false, {
    key: AUTH_TOKEN_SECRET,
    validateFunc: require('./modules/auth.validate')
});

server.register(require('inert'), (err) => {});

server.register(require('vision'), (err) => {
    server.views({
        engines: {
            html: handlebars
        },
        relativeTo: __dirname,
        path: './views',
        layout: true,
        layoutPath: './views/layouts',
        helpersPath: './views/helpers',
        partialsPath: './views/partials',
        context: defaultContext
    });
});

server.register({
    register: hapiSitemap.register,
    options: {
        baseUri: 'https://www.csgpro.com'
    }
},
function(err) {
    if (err) {
        console.error('Failed to load plugin: ', err);
    }
});

// Handle errors
server.ext('onPreResponse', function (request, reply) {
    if (request.response.variety === 'view') {
        const context = request.response.source.context;
        context.sitemap = sitemap.getPages();
    }
    if (request.response.isBoom) {
        let response: hapi.IBoom = <any>request.response;
        let code = response.output.statusCode;
        if (code === 404 || code === 500) {
            let template: any = code;
            let title = response.output.payload.error;
            let message = response.stack;
            return reply.view(template, { title: title, message: message, statusCode: code, sitemap: sitemap.getPages() }).code(code);
        }
    }

    return reply.continue();
});

routes.init(server);

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
        throw (err);
    }
    // Start server
    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

export = server;