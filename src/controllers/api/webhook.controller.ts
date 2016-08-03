'use strict';

// hapi
import * as hapi from 'hapi';
import * as boom from 'boom';

// app
import { getWebhooks, getWebhook, createWebhook, updateWebhook, deleteWebhook } from '../../commands/webhook.commands';

getWebhooksApi.route = '/api/webhook';
getWebhooksApi.auth = 'jwt';
export function getWebhooksApi(request: hapi.Request, reply: hapi.IReply) {
    getWebhooks().then(categories => {
        reply({ data: categories });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

getWebhookApi.route = '/api/webhook/{id}';
getWebhookApi.auth = 'jwt';
export function getWebhookApi(request: hapi.Request, reply: hapi.IReply) {
    let webhookId = Number(request.params['id']);
    getWebhook(webhookId).then(webhook => {
        reply({ data: webhook });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

createWebhookApi.auth = 'jwt';
createWebhookApi.method = 'POST';
createWebhookApi.route = '/api/webhook';
export function createWebhookApi(request: hapi.Request, reply: hapi.IReply) {
    let webhook = request.payload;
    createWebhook(webhook).then(data => {
        reply({ message: 'saved', data });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

updateWebhookApi.auth = 'jwt';
updateWebhookApi.method = 'PUT';
updateWebhookApi.route = '/api/webhook/{id}';
export function updateWebhookApi(request: hapi.Request, reply: hapi.IReply) {
    let webhook = request.payload;
    updateWebhook(webhook).then(data => {
        reply({ message: 'saved', data });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

deleteWebhookApi.auth = 'jwt';
deleteWebhookApi.method = 'DELETE';
deleteWebhookApi.route = '/api/webhook/{id}';
export function deleteWebhookApi(request: hapi.Request, reply: hapi.IReply) {
    let webhookId = Number(request.params['id']);
    deleteWebhook(webhookId).then(count => {
        if (count) {
            reply({ message: 'deleted', });
        } else {
            reply({ message: 'zero affected rows' });
        }
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}