'use strict';

// hapi
import * as hapi from 'hapi';
import * as boom from 'boom';

// app
import { getPostCategories, getPostCategory } from '../../commands/post.commands';

getPostCategoriesApi.route = '/api/category';
getPostCategoriesApi.auth = 'jwt';
export function getPostCategoriesApi(request: hapi.Request, reply: hapi.IReply) {
    getPostCategories().then(categories => {
        reply({ data: categories });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

getPostCategoryApi.route = '/api/category/{id}';
getPostCategoryApi.auth = 'jwt';
export function getPostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
    let categoryId = +request.params['id'];
    getPostCategory(categoryId).then(category => {
        if (!category) {
            reply(boom.notFound());
            return;
        }
        reply({ data: category.toJSON() });
    });
}

createPostCategoryApi.auth = 'jwt';
createPostCategoryApi.method = 'POST';
createPostCategoryApi.route = '/api/category';
export function createPostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

updatePostCategoryApi.auth = 'jwt';
updatePostCategoryApi.method = 'PUT';
updatePostCategoryApi.route = '/api/category/{id}';
export function updatePostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

deletePostCategoryApi.auth = 'jwt';
deletePostCategoryApi.method = 'DELETE';
deletePostCategoryApi.route = '/api/category/{id}';
export function deletePostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}