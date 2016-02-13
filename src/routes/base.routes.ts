'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getHomepageContext } from '../controllers/base.controller';

const routes: hapi.IRouteConfiguration[] = [
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.'
            },
            
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            getHomepageContext((err, context) => {
                if (err) {
                    reply(boom.create(500, err));
                } else {
                    reply.view(context.template, context);
                }
            });
        }
    }
];

export = routes;