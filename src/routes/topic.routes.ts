'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { Topic, ITopicModel } from '../models/topic.model';

const routes: hapi.IRouteConfiguration[] = [
    {
        method: 'GET',
        path: '/topics',
        handler: (request, reply) => {
            Topic.findAndCountAll({ attributes: ['topic', 'slug']}).then((results) => {
                let response = { topicCount: results.count, topics: results.rows };
                reply(response);
            }, (err) => {
                reply(boom.create(500, err));
            });
        }
    }
];

export = routes;