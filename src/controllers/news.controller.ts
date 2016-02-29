'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostCategory } from '../commands/post.commands';

news.title = 'News';
export function news(request: hapi.Request, reply: hapi.IReply) {
    getPostCategory('news').then(category => {
        reply.view('category', { title: news.title, description: '', category });
    });
}

export function show(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'news').then(post => {
        if (!post) {
            reply(boom.notFound());
        }
        reply.view('post', post);
    });
}