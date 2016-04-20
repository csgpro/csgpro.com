'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostCategory } from '../commands/post.commands';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    getPostCategory('blog').then(category => {
        reply.view('category', { title: 'Blog', description: '', category }, { layout: 'hero-layout' });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

export function read(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'blog').then(post => {
        if (!post) {
            reply(boom.notFound());
        }
        reply.view('post', post.toJSON());
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}