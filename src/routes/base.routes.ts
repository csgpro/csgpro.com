'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import * as path from 'path';
import { getHomepageContext } from '../controllers/base.controller';

const routes: hapi.IRouteConfiguration[] = [
    {
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            getHomepageContext((err, context) => {
                if (err) {
                    reply(boom.create(500, <any>err));
                } else {
                    reply.view(context.template, context);
                }
            });
        }
    },
    {
        method: 'GET',
        path: '/resources/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                listing: true
            }
        }
    },
    {
        method: 'GET',
        path: '/img/{param*}',
        handler: (request, reply) => {
            let path = request.path.replace('img', 'resources/images');
            reply.redirect(path);
        }
    },
];

export = routes;