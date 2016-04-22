'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getCategory, getTopics } from '../commands/post.commands';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    let promises: Promise<any>[] = [];
    
    promises.push(getTopics());
    promises.push(getCategory('career'));
    
    Promise.all(promises).then(data => {
        reply.view('category', { title: 'Careers', description: '', posts: data[1].posts, topics: data[0] });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

export function show(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'career').then(job => {
        if (!job) {
            reply(boom.notFound());
        }
        reply.view('post', job.toJSON());
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}