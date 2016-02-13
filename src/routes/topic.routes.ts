'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import * as Sequelize from 'sequelize';
import { User } from '../models/user.model';
import { Topic } from '../models/topic.model';
import { Post } from '../models/post.model';
import { PostCategory } from '../models/post-category.model';

const routes: hapi.IRouteConfiguration[] = [
    {
        method: 'GET',
        path: '/topics',
        handler: (request, reply) => {
            Topic.findAndCountAll({ attributes: ['topic', 'slug'] }).then((results) => {
                let response = { topicCount: results.count, topics: results.rows };
                reply(response);
            }, (err) => {
                reply(boom.create(500, err));
            });
        }
    },
    {
        method: 'GET',
        path: '/topics/{topicSlug}',
        handler: (request, reply) => {
            let topicSlug = request.params['topicSlug']; // 'blog', 'news', 'career'
            let includePosts: boolean = (request.query.includePosts && (request.query.includePosts === 'true')); // ?includePosts=true
            Topic.findOne({ where: { slug: topicSlug } }).then(topic => {
                if (!topic) {
                    return reply(boom.notFound());
                }
                
                let topicJSON = { topic: topic.get('topic'), slug: topic.get('slug') };
                
                if (!includePosts) {
                    reply({ topic: topicJSON });
                } else {
                    // Get Posts for topicSlug Where publishedDate > Jan 1, 1993
                    // Include the post category.
                    let postAttributes: any = ['title', 'slug', 'excerpt', 'publishedAt'];
                    let getPostsWhere: Sequelize.WhereOptions = { publishedAt: { $gt: new Date('1993-01-01') } };
                    let getPostsIncludes = [{ model: PostCategory, as: 'category', attributes: { exclude: ['id'] } }, { model: User, as: 'author', attributes: { exclude: ['id', 'username', 'createdAt', 'updatedAt', 'password', 'roleId'] } }];
                    // exclude the 'postTopic' object by passing an empty array to `joinTableAttributes`
                    let getPostsOptions: any = { where: getPostsWhere, attributes: postAttributes, joinTableAttributes: [], include: getPostsIncludes };
                    
                    topic.getPosts(getPostsOptions).then(posts => {
                        reply({ topic: topicJSON, postCount: posts.length, posts: posts });
                    });
                }
            });
        }
    }
];

export = routes;