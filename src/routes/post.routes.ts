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
        path: '/posts',
        handler: (request, reply) => {
            let attributes: any = ['title', 'slug', 'excerpt', 'createdAt', 'publishedAt'];
            Post.findAndCountAll({ attributes: attributes, where: { publishedAt: { $ne: null }} }).then(results => {
                let response = { postCount: results.count, posts: results.rows };
                reply(response);
            }, (err) => {
                reply(boom.create(500, err));
            });
        }
    },
    {
        method: 'GET',
        path: '/{categorySlug}/{postSlug}',
        handler: (request, reply) => {
            let categorySlug = request.params['categorySlug'];
            let postSlug = request.params['postSlug'];
            PostCategory.findOne({ where: { slug: categorySlug } }).then(category => {
                if (category) {
                    category.getPosts({ where: { slug: postSlug } }).then(posts => {
                        if (posts && posts[0]) {
                            let post = posts[0].toJSON();
                            return reply.view('home', { title: post.title, address: post.post });
                        }
                        return reply(boom.notFound());
                    });
                } else {
                    reply.continue();
                }
            });
        }
    },
    {
        method: 'GET',
        path: '/{categorySlug}',
        handler: (request, reply) => {
            let categorySlug = request.params['categorySlug'];
            let includePosts: boolean = (request.query.includePosts && (request.query.includePosts === 'true')); // ?includePosts=true
            PostCategory.findOne({ where: { slug: categorySlug } }).then(category => {
                if (!category) {
                    return reply(boom.notFound());
                }
                
                let categoryJSON = { category: category.get('category'), slug: category.get('slug') };
                
                if (!includePosts) {
                    reply({ category: categoryJSON });
                } else {
                    // Get Posts for topicSlug Where publishedDate > Jan 1, 1993
                    // Include the post category.
                    let postAttributes: any = ['title', 'slug', 'excerpt', 'publishedAt'];
                    let getPostsWhere: Sequelize.WhereOptions = { publishedAt: { $gt: new Date('1993-01-01') } };
                    let getPostsIncludes = [{ model: Topic, attributes: { exclude: ['id'] }, through: { attributes: <any>[] } }, { model: User, as: 'author', attributes: { exclude: ['id', 'username', 'createdAt', 'updatedAt', 'password', 'roleId'] } }];
                    // exclude the 'postTopic' object by passing an empty array to `joinTableAttributes`
                    let getPostsOptions: any = { where: getPostsWhere, attributes: postAttributes, joinTableAttributes: [], include: getPostsIncludes };
                    
                    category.getPosts(getPostsOptions).then(posts => {
                        reply({ category: categoryJSON, postCount: posts.length, posts: posts });
                    });
                }
            });
        }
    }
];

export = routes;
