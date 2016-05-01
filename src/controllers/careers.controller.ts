'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getCategory, getTopics } from '../commands/post.commands';

index.sitemap = true;
index.route = '/careers/{page?}'
export function index(request: hapi.Request, reply: hapi.IReply) {
    
    let promises: Promise<any>[] = [];
    let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
    let limit = 10;
    let offset = page <= 1 ? 0 : (page * limit) - limit;
    
    promises.push(getTopics());
    promises.push(getCategory('career', undefined, offset, limit));
    
    Promise.all(promises).then(data => {
        reply.view('category', { title: 'Careers', description: '', posts: data[1].rows, topics: data[0], pagination: { basePath: '/careers', pageCount: Math.ceil(data[1].count / limit), page } });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

read.route = '/careers/{year}/{month}/{slug}';
export function read(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'career').then(job => {
        if (!job) {
            reply(boom.notFound());
        }
        let jobJSON = job.toJSON();
        reply.view('post', { title: jobJSON.title, post: jobJSON }, { layout: 'hero-layout' });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}