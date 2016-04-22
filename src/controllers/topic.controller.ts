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
        reply.view('category', { title: data[1].topic, description: '', posts: data[1].posts, topics: data[0] });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}