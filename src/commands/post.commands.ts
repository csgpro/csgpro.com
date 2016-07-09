'use strict';

import * as Sequelize from 'sequelize';
import { database } from '../database';
import { User } from '../models/user.model';
import { Topic, ITopicInstance } from '../models/topic.model';
import { Post, IPostInstance, PostTopic } from '../models/post.model';
import { PostCategory } from '../models/post-category.model';
import * as _ from 'lodash';

export function getPost(postSlug: string, categorySlug: string) {
    return Post.findOne({
        where: { slug: postSlug },
        include: [{ model: User, as: 'author' }, { model: Topic, as: 'topics' }, { model: PostCategory, as: 'category' }]
    }).then(post => {
        if (!post || (post.getDataValue('category').slug !== categorySlug)) {
            return;
        } else {
            return post;
        }
    });
}

export function getPostByPostId(postId: number) {
    return Post.findOne({
        where: { id: postId },
        include: [{ model: User, as: 'author' }, { model: Topic, as: 'topics' }, { model: PostCategory, as: 'category' }]
    });
}

export function getTopics(where: Sequelize.WhereOptions = { active: true }, order = 'topic') {
    return Topic.findAndCountAll({ where, order }).then(data => {
        let topics = [...data.rows];
        Object.defineProperty(topics, 'count', {
            value: data.count
        });
        return topics;
    });
}

export function getTopic(topic: string|number, includePosts = true, sortOrder: 'ASC' | 'DESC' = 'DESC'): Promise<any> {
    let where: any = {};
    if (typeof topic === 'string') {
        where = { slug: topic };
    } else {
        where = { id: topic };
    }

    if (includePosts) {
        return Topic.findOne({ where }).then(topic => {
            return topic.getPosts({ order: [[ 'publishedAt', sortOrder ]], scope: <any>{ method: ['list'] } }).then(posts => [topic, posts]);
        });
    } else {
        return Topic.findOne({ where });
    }
}

export function getPostsByCategory(category: string, published = true, sortOrder: 'ASC' | 'DESC' = 'DESC', offset?: number, limit = 6) {
    limit = (isNaN(limit)) ? undefined : +limit;
    offset = (isNaN(offset)) ? undefined : +offset;
    let options: any = {
        order: [[ 'publishedAt', sortOrder ]]
    };
    if (limit) {
        options.limit = limit;
    }
    if (offset) {
        options.offset = offset;
    }
    return Post.scope({ method: ['list', published, category] }).findAndCount(options).then(data => {
        let posts = [...data.rows];
        Object.defineProperty(posts, 'count', {
            value: data.count
        });
        return posts;
    })
}

export function getPostsByTopic(topics: string[], sortOrder: 'ASC' | 'DESC' = 'DESC', limit = 6) {
    return Topic.findAll({
        where: { slug: { $in: topics } },
        include: [{ model: Post.scope({ method: ['list', undefined, undefined, sortOrder] }) }]
    }).then((topics) => {
        let queue = [];
        
        topics.forEach(topic => {
            queue.push(topic.getPosts({
                include: [{ model: PostCategory, as: 'category' }],
                where: { publishedAt: { $gt: new Date('1993-01-01') } },
                order: [[ 'publishedAt', sortOrder ]]
            }));
        });
        
        return Promise.all<IPostInstance>(queue).then((data) => {
            let posts = _.flatten(data);
            let postsRaw = posts.map(post => post.toJSON());
            
            return _.take(_.uniqBy(postsRaw, 'id'), limit);
        });
    });
}

export function getPostCategories() {
    return PostCategory.findAndCountAll().then(data => {
        let categories = [...data.rows];
        Object.defineProperty(categories, 'count', {
            value: data.count
        });
        return categories;
    })
}

export function getPostCategory(categoryId: number) {
    return PostCategory.findOne({ where: { id: categoryId } });
}

export function createPost(post: any) {
    post.authorId = post.author.id;
    post.postCategoryId = post.category.id;
    return Post.create(post);
}

export function updatePost(post: any): Promise<IPostInstance> {
    post.authorId = post.author.id;
    post.categoryId = post.category.id;
    let topics: any[] = post.topics;
    let resultPost: IPostInstance;
    return database.transaction(function(t) {
        return Post.update(post, { where: { id: post.id }, transaction: t }).then(() => {
            // Update post
            return Post.findOne({ where: { id: post.id }, transaction: t });
        }).then(p => {
            // Update topics
            resultPost = p;
            if (topics && topics.length) {
                let queue = [];
                topics.forEach(topic => {
                    queue.push(Topic.findOne({ where: { id: topic.id } }));
                });

                return Promise.all(queue).then(topicsArray => {
                    return p.setTopics(topicsArray, { transaction: t });
                });
            } else {
                return p.setTopics([], { transaction: t });
            }
        });
    });
}