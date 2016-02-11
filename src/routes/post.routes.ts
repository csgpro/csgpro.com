'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import * as Sequelize from 'sequelize';
import { Post, IPostModel } from '../models/post.model';
import { Topic } from '../models/topic.model';

const routes: hapi.IRouteConfiguration[] = [
    {
        method: 'GET',
        path: '/posts',
        handler: (request, reply) => {
            let attributes: any = ['title', 'slug', 'excerpt', 'createdAt', 'publishedAt'];
            Post.findAndCountAll({ attributes: attributes, where: { publishedAt: { $ne: null }} }).then(results => {
                let response = { postCount: results.count, posts: results.rows };
                reply(response);
            }, (err) => {
                reply(boom.create(500, err));
            });
        }
    }
];

export = routes;