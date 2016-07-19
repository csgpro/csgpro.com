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
    },
    {
        method: 'GET',
        path: '/robots.txt',
        handler: (request: hapi.Request, reply: hapi.IReply) => {
            const host = request.headers['host'];
            if (!/^www.csgpro.com$/.test(host)) {
                reply.file(path.join('..', 'public', 'block-robots.txt'));
            } else {
                reply.file(path.join('..', 'public', 'robots.txt'));
            }
        }
    },
    {
        method: 'GET',
        path: '/admin/{param*}',
        handler: (request: hapi.Request, reply: hapi.IReply) => {
            reply.file(path.join('..', 'public', 'admin', 'index.html'));
        },
        config: {
            plugins: {
                sitemap: { exclude: true }
            }
        }
    }
];

export = routes;