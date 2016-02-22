'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import * as path from 'path';

const routes: hapi.IRouteConfiguration[] = [
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
    }
];

export = routes;