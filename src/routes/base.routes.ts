'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getHomepageContext } from '../controllers/base.controller';

const routes: hapi.IRouteConfiguration[] = [
    {
        method: 'GET',
        path: '/scripts/{param*}',
        handler: {
            directory: {
                path: './scripts'
            }
        }
    },
    {
        method: 'GET',
        path: '/styles/{param*}',
        handler: {
            directory: {
                path: './styles'
            }
        }
    },
    {
        method: 'GET',
        path: '/images/{param*}',
        handler: {
            directory: {
                path: './images'
            }
        }
    },
    {
        method: 'GET',
        path: '/img/{param*}',
        handler: {
            directory: {
                path: './images'
            }
        }
    },
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
    }
];

export = routes;