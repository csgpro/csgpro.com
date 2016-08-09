// hapi
import * as hapi from 'hapi';
import * as boom from 'boom';

// app
import { getPostsByCategory, getPostByPostId, updatePost, createPost } from '../../commands/post.commands';

// posts

getPostsApi.route = '/api/post';
getPostsApi.auth = 'jwt';
export function getPostsApi(request: hapi.Request, reply: hapi.IReply) {
    let {category, published, sort, offset, limit}  = request.query;
    published = 'false' ? false : true;
    getPostsByCategory(category, published, sort, offset, limit).then(posts => {
        reply({ data: posts });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

getPostApi.route = '/api/post/{id}';
getPostApi.auth = 'jwt';
export function getPostApi(request: hapi.Request, reply: hapi.IReply) {
    let postId = +request.params['id'];
    getPostByPostId(postId).then(post => {
        if (!post) {
            reply(boom.notFound());
            return;
        }
        reply({ data: post.toJSON() });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

createPostApi.auth = 'jwt';
createPostApi.method = 'POST';
createPostApi.route = '/api/post';
export function createPostApi(request: hapi.Request, reply: hapi.IReply) {
    let post = request.payload;
    createPost(post).then(data => {
        reply({ message: 'saved', data });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

updatePostApi.auth = 'jwt';
updatePostApi.method = 'PUT';
updatePostApi.route = '/api/post/{id}';
export function updatePostApi(request: hapi.Request, reply: hapi.IReply) {
    let post = request.payload;
    updatePost(post).then(data => {
        reply({ message: 'saved', data });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

deletePostApi.auth = 'jwt';
deletePostApi.method = 'DELETE';
deletePostApi.route = '/api/post/{id}';
export function deletePostApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}