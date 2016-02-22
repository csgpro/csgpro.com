'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostCategory } from '../commands/post.commands';

blog.title = 'Blog';
export function blog(request: hapi.Request, reply: hapi.IReply) {
    getPostCategory('blog').then(category => {
        reply.view('category', { title: blog.title, description: '', category });
    });
}

export function show(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'blog').then(post => {
        if (!post) {
            reply(boom.notFound());
        }
        reply.view('post', post);
    });
}