'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getTopic } from '../commands/post.commands';

export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.redirect('/blog');
}

export function show(request: hapi.Request, reply: hapi.IReply) {
    let topicSlug: string = request.params['slug'];
    getTopic(topicSlug).then(topic => {
        if (!topic) {
            reply(boom.notFound());
        }
        reply.view('topic', { title: topic.getDataValue('topic'), description: '', topic }, { layout: 'hero-layout' });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}