'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getTopic, getTopics } from '../commands/post.commands';

export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.redirect('/blog');
}

export function show(request: hapi.Request, reply: hapi.IReply) {
    let topicSlug: string = request.params['slug'];
    
    let promises: Promise<any>[] = [];
    
    promises.push(getTopics());
    promises.push(getTopic(topicSlug));
    
    Promise.all(promises).then(data => {
        let [topic, posts] = data[1];
        reply.view('category', { title: topic.topic, description: '', posts, topics: data[0] });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

rssTopic.route = '/topic/{slug}/feed/rss';
export function rssTopic(request: hapi.Request, reply: hapi.IReply) {
    let topicSlug: string = request.params['slug'];
    let host = request.headers['host'];
    let permalink = `/topic/${topicSlug}/feed/rss`;
    getTopic(topicSlug).then(data => {
        let [topic, posts] = data;
        let title = `CSG Pro ${topic.topic} Posts`;
        let description = `Lastest posts about "${topic.topic}"`;
        reply.view('rss', { posts, host, title, description, permalink }, { layout: 'blank' }).type('text/xml');
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}