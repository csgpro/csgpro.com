// hapi
import * as hapi from 'hapi';
import * as boom from 'boom';

// app
import { getPostsByCategory, getPostByPostId } from '../../commands/post.commands';

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

updatePostApi.method = 'PUT';
updatePostApi.route = '/api/post/{id}';
export function updatePostApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

deletePostApi.method = 'DELETE';
deletePostApi.route = '/api/post/{id}';
export function deletePostApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}