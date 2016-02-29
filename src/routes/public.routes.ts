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
        },
        config: {
            plugins: {
                sitemap: {
                    exclude: true
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/img/{param*}',
        handler: (request, reply) => {
            let path = request.path.replace('img', 'resources/images');
            reply.redirect(path);
        },
        config: {
            plugins: {
                sitemap: {
                    exclude: true
                }
            }
        }
    }
];

export = routes;