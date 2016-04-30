'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPost, getCategory, getTopics } from '../commands/post.commands';

index.sitemap = true;
index.route = '/blog/{page?}'
export function index(request: hapi.Request, reply: hapi.IReply) {
    
    let promises: Promise<any>[] = [];
    let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
    let limit = 10;
    let offset = page <= 1 ? 0 : (page * limit) - limit;
    let something = 'something';
    
    promises.push(getTopics());
    promises.push(getCategory('blog', undefined, offset, limit));
    
    Promise.all(promises).then(data => {
        reply.view('category', { title: 'Blog', description: '', posts: data[1].rows, topics: data[0], pagination: { basePath: '/blog', pageCount: Math.ceil(data[1].count / limit), page } });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

list.route = '/api/posts';
export function list(request: hapi.Request, reply: hapi.IReply) {
    let lastIndex = Number(request.params['lastIndex']);
    let limit = Number(request.params['limit']);
    getCategory('blog').then(posts => {
        reply({ data: posts });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

read.route = '/blog/{year}/{month}/{slug}';
export function read(request: hapi.Request, reply: hapi.IReply) {
    let postSlug: string = request.params['slug'];
    getPost(postSlug, 'blog').then(post => {
        if (!post) {
            reply(boom.notFound());
        }
        let postJSON = post.toJSON();
        reply.view('post', { title: postJSON.title, post: postJSON }, { layout: 'hero-layout' });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(500, 'Bad Connection'));
        } else {
            reply(boom.create(500, err.message));
        }
    });
}

function getPagination(totalPages: number, currentPage: number) {
    let pagination = {
        pages: [],
        previous: null,
        next: null
    };
    
    if (currentPage >= 2) {
        let previousPage = currentPage - 1;
        pagination.previous = {
            url: `/blog/${previousPage}`,
            label: 'Previous'
        };
    }
    
    for(let i = 0; i < totalPages; i++) {
        pagination.pages.push({
            url: `/blog/${i + 1}`,
            label: i + 1
        });
    }
    
    if (currentPage !== totalPages) {
        let nextPage = currentPage + 1;
        pagination.next = {
            url: `/blog/${nextPage}`,
            label: 'Next'
        };
    }
    
    return pagination;
}