'use strict';

// hapi
import * as hapi from 'hapi';
import * as boom from 'boom';

// app
import { getUsers, getUser } from '../../commands/user.commands';

getUsersApi.route = '/api/user';
export function getUsersApi(request: hapi.Request, reply: hapi.IReply) {
    getUsers().then(data => {
        let users = [...data.rows];
        Object.defineProperty(users, 'count', {
            value: data.count
        });
        reply({ data: users });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

getUserApi.route = '/api/user/{id}'
export function getUserApi(request: hapi.Request, reply: hapi.IReply) {
    let userId = +request.params['id'];
    getUser(userId).then(user => {
        if (!user) {
            reply(boom.notFound());
            return;
        }
        reply({ data: user.toJSON() });
    })
}

createUserApi.method = 'POST';
createUserApi.route = '/api/user';
export function createUserApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

updateUserApi.method = 'PUT';
updateUserApi.route = '/api/user/{id}';
export function updateUserApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

deleteUserApi.method = 'DELETE';
deleteUserApi.route = '/api/user/{id}';
export function deleteUserApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}