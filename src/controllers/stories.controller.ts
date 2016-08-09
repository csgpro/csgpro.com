'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView } from '../modules/view-matcher';
import { getStories } from '../commands/story.commands';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    
    const featuredStoriesPromise = getStories('featured');
    const storiesPromise = getStories('active', undefined, undefined, undefined, null);
    
    Promise.all([featuredStoriesPromise, storiesPromise]).then(data => {
        let featuredStories = data[0].rows;
        let stories = data[1].rows;
        reply.view(pageView('stories'), {
            title: 'Stories',
            description: '',
            stories,
            totalStories: data[1].count,
            featuredStories
        });
    });
}

list.route = '/api/stories';
export function list(request: hapi.Request, reply: hapi.IReply) {
    let lastIndex: number;
    if (request.params['lastIndex'] && !isNaN(Number(request.params['lastIndex']))) {
        lastIndex = Number(request.params['lastIndex']);
    }
    let limit: number;
    if (request.params['offset'] && !isNaN(Number(request.params['offset']))) {
        limit = Number(request.params['limit']);
    }
    let offset: number;
    if (request.params['offset'] && !isNaN(Number(request.params['offset']))) {
        offset = Number(request.params['offset']);
    }
    let sortOrder: any = request.params['sortOrder'];
    let search = request.params['search'];
    getStories('active', search, sortOrder, offset, limit).then(stories => {
        reply({ data: stories });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}