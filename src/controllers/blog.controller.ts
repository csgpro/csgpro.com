'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getCategory, getTopics } from '../commands/post.commands';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    
    let promises: Promise<any>[] = [];
    
    promises.push(getTopics());
    promises.push(getCategory('blog'));
    
    Promise.all(promises).then(data => {
        reply.view('category', { title: 'Blog', description: '', posts: data[1].posts, topics: data[0] });
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
    getCategory('blog').then(posts => {
        reply({ data: posts });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

export function read(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'blog').then(post => {
        if (!post) {
            reply(boom.notFound());
        }
        let postJSON = post.toJSON();
        reply.view('post', { title: postJSON.title, post });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}