'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getCategory, getTopics } from '../commands/post.commands';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    let promises: Promise<any>[] = [];
    
    promises.push(getTopics());
    promises.push(getCategory('news'));
    
    Promise.all(promises).then(data => {
        reply.view('category', { title: 'News', description: '', posts: data[1].posts, topics: data[0] });
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