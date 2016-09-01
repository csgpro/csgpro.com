'use strict';

// load environment variables
import * as conf from 'nconf';
conf.env().file({ file: __dirname + '/../settings.json' });

// libs
import * as hapi from 'hapi';
import * as path from 'path';
const handlebars = require('handlebars');
const paginate = require('handlebars-paginate');

// app
import * as routes from './routes';
import * as sitemap from './modules/sitemap';
import { initializeDB } from './database';
import * as hapiSitemap from './modules/hapi-sitemap';

const AUTH_TOKEN_SECRET: string = conf.get('AUTH_TOKEN_SECRET');
const GTM_KEY: string = conf.get('GOOGLE_TAG_MANAGER_KEY');

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
    sitename: 'CSG Pro',
    GTM_KEY
};

initializeDB(server);

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
            let template: any = code.toString();
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
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
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