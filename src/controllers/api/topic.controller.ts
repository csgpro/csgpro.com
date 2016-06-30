'use strict';

// hapi
import * as hapi from 'hapi';
import * as boom from 'boom';

// app
import { getTopics, getTopic } from '../../commands/post.commands';

getTopicsApi.route = '/api/topic';
export function getTopicsApi(request: hapi.Request, reply: hapi.IReply) {
    getTopics().then(topics => {
        reply({ data: topics });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

getTopicApi.route = '/api/topic/{id}'
export function getTopicApi(request: hapi.Request, reply: hapi.IReply) {
    let { id, includePosts } = request.params;
    let topicId = +id; // It needs to be a number;
    getTopic(topicId, !!includePosts).then(topic => {
        if (!topic) {
            reply(boom.notFound());
            return;
        }
        reply({ data: topic.toJSON() });
    })
}

createTopicApi.method = 'POST';
createTopicApi.route = '/api/topic';
export function createTopicApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

updateTopicApi.method = 'PUT';
updateTopicApi.route = '/api/topic/{id}';
export function updateTopicApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

deleteTopicApi.method = 'DELETE';
deleteTopicApi.route = '/api/topic/{id}';
export function deleteTopicApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}