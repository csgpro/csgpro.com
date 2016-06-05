'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostsByCategory, getTopics } from '../commands/post.commands';

/**
 * TODO: Add migration to change post category from 'news' to 'events'.  Remove 'event' topic.
 */

index.sitemap = true;
index.route = '/events/{page?}'
export function index(request: hapi.Request, reply: hapi.IReply) {
    
    let promises: Promise<any>[] = [];
    let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
    let limit = 10;
    let offset = page <= 1 ? 0 : (page * limit) - limit;
    
    getPostsByCategory('news', undefined, offset, limit).then(data => {
        reply.view('category', { title: 'Events', description: '', posts: data.rows, pagination: { basePath: '/events', pageCount: Math.ceil(data.count / limit), page } });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

read.route = '/events/{year}/{month}/{slug}';
export function read(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'news').then(news => {
        if (!news) {
            reply(boom.notFound());
        }
        let newsJSON = news.toJSON();
        reply.view('post', { title: newsJSON.title, post: newsJSON }, { layout: 'hero-layout' });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}