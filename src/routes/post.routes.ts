'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPostCategory, getPostTopic, getPost } from '../controllers/post.controller';

const routes: hapi.IRouteConfiguration[] = [
    {
        method: 'GET',
        path: '/{categorySlug}/{postSlug}',
        handler: (request, reply) => {
            let categorySlug = request.params['categorySlug'];
            let postSlug = request.params['postSlug'];
            getPost(postSlug).then(post => {
                if (!post || (post.getDataValue('category').slug !== categorySlug)) {
                    reply(boom.notFound());
                } else {
                    reply.view('post-single', post);
                }
            }, err => {
                reply(boom.create(500, err));
            });
        }
    },
    {
        method: 'GET',
        path: '/{categorySlug}',
        handler: (request, reply) => {
            let categorySlug = request.params['categorySlug'];
            getPostCategory(categorySlug).then(category => {
                if (!category) {
                    reply(boom.notFound());
                } else {
                    // TODO: Configure category specific templates
                    reply.view('post-category', { title: category.getDataValue('category'), description: '', category: category });
                }
            });
        }
    },
    {
        method: 'GET',
        path: '/topic',
        handler: (request, reply) => {
            reply.redirect('/blog');
        }
    },
    {
        method: 'GET',
        path: '/topics',
        handler: (request, reply) => {
            reply.redirect('/blog');
        }
    },
    {
        method: 'GET',
        path: '/topic/{topicSlug}',
        handler: (request, reply) => {
            let topicSlug = request.params['topicSlug'];
            getPostTopic(topicSlug).then(topic => {
                if (!topic) {
                    reply(boom.notFound());
                } else {
                    reply.view('post-topic', { title: topic.getDataValue('topic'), description: '', topic: topic });
                }
            });
        }
    }
];

export = routes;
