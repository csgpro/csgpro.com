'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostsByCategory, getTopics, getPostByPostId } from '../commands/post.commands';
import { pageHeader } from '../modules/view-matcher';
import { getProtocolByHost } from '../modules/utility';

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

legacyPostRoute.route = '/post/{id}';
export function legacyPostRoute(request: hapi.Request, reply: hapi.IReply) {
    let postId = Number(request.params['id']);
    getPostByPostId(postId).then(post => {
        if (!post) {
            reply(boom.notFound());
            return;
        }
        let host = request.headers['host'];
        let protocol = getProtocolByHost(host);
        let postJSON = post.toJSON();
        let POST_URL = `${protocol}://${host}${postJSON.permalink}`;
        reply.redirect(POST_URL);
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

read.route = '/blog/{year}/{month}/{slug}';
export function read(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'blog').then(post => {
        if (!post) {
            reply(boom.notFound());
            return;
        }
        let host = request.headers['host'];
        let protocol = getProtocolByHost(host);
        let postJSON = post.toJSON();
        let POST_URL = `${protocol}://${host}${postJSON.permalink}`;
        reply.view('post', {
            title: postJSON.title,
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