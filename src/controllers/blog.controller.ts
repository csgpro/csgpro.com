'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostsByCategory, getTopics } from '../commands/post.commands';
import { pageHeader } from '../modules/view-matcher';

index.sitemap = true;
index.route = '/blog/{page?}'
export function index(request: hapi.Request, reply: hapi.IReply) {
    
    let promises: Promise<any>[] = [];
    let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
    let limit = 10;
    let offset = page <= 1 ? 0 : (page * limit) - limit;
    
    promises.push(getTopics());
    promises.push(getPostsByCategory('blog', undefined, offset, limit));
    
    Promise.all(promises).then(data => {
        reply.view('category', {
            title: 'Blog',
            description: '',
            posts: data[1].rows,
            topics: data[0],
            pagination: {
                basePath: '/blog',
                pageCount: Math.ceil(data[1].count / limit),
                page
            }
        });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

list.route = '/api/posts';
export function list(request: hapi.Request, reply: hapi.IReply) {
    let lastIndex = Number(request.params['lastIndex']);
    let limit = Number(request.params['limit']);
    getPostsByCategory('blog').then(posts => {
        reply({ data: posts });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

read.route = '/blog/{year}/{month}/{slug}';
export function read(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'blog').then(post => {
        if (!post) {
            reply(boom.notFound());
        }
        let postJSON = post.toJSON();
        let POST_URL = `${request.server.info.protocol}://${request.headers['host']}${postJSON.permalink}`;
        reply.view('post', {
            title: postJSON.title,
            header: pageHeader('marina'),
            post: postJSON,
            POST_URL,
            POST_ID: postJSON.id,
            isBlogPost: true
        }, { layout: 'hero-layout' });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}