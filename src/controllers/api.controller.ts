'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getPostsByCategory, getTopics, getPostByPostId } from '../commands/post.commands';
import { getUsers } from '../commands/user.commands';
import { pageHeader } from '../modules/view-matcher';
import { getProtocolByHost } from '../modules/utility';

// posts

getPostsApi.route = '/api/post';
export function getPostsApi(request: hapi.Request, reply: hapi.IReply) {
    let {category, sort, offset, limit}  = request.query;
    getPostsByCategory(category, sort, offset, limit).then(data => {
        let posts = [...data.rows];
        Object.defineProperty(posts, 'count', {
            value: data.count
        });
        reply({ data: posts });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

getPostApi.route = '/api/post/{id}'
export function getPostApi(request: hapi.Request, reply: hapi.IReply) {
    let postId = +request.params['id'];
    getPostByPostId(postId).then(post => {
        if (!post) {
            reply(boom.notFound());
            return;
        }
        reply({ data: post.toJSON() });
    })
}

createPostApi.method = 'POST';
createPostApi.route = '/api/post';
export function createPostApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

// users

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

// getPostApi.route = '/api/post/{id}'
// export function getPostApi(request: hapi.Request, reply: hapi.IReply) {
//     let postId = +request.params['id'];
//     getPostByPostId(postId).then(post => {
//         if (!post) {
//             reply(boom.notFound());
//             return;
//         }
//         reply({ data: post.toJSON() });
//     })
// }

// createPostApi.method = 'POST';
// createPostApi.route = '/api/post';
// export function createPostApi(request: hapi.Request, reply: hapi.IReply) {
//     reply(boom.notImplemented());
// }