'use strict';

import * as Sequelize from 'sequelize';
import { User } from '../models/user.model';
import { Topic, ITopicInstance } from '../models/topic.model';
import { Post, IPostInstance } from '../models/post.model';
import { PostCategory } from '../models/post-category.model';
import * as _ from 'lodash';

export function getPost(postSlug: string, categorySlug: string) {
    return Post.unscoped().findOne({
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
    return Post.unscoped().findOne({
        where: { id: postId },
        include: [{ model: User, as: 'author' }, { model: Topic, as: 'topics' }, { model: PostCategory, as: 'category' }]
    });
}

export function getTopics(where: Sequelize.WhereOptions = { active: true }, order = 'topic') {
    return Topic.findAll({ where, order });
}

export function getTopic(topic: string, sortOrder: 'ASC' | 'DESC' = 'DESC') {
    return Topic.findOne({ where: { slug: topic }}).then(t => {
        return t.getPosts({
            where: { publishedAt: { $gt: new Date('1993-01-01') } },
            order: [[ 'publishedAt', sortOrder]],
            include: [{ model: User, as: 'author' }, { model: Topic, as: 'topics' }, { model: PostCategory, as: 'category' }]
        }).then(posts => {
            return { topic: t.getDataValue('topic'), posts };
        });
    });
}

export function getPostsByCategory(category: string, sortOrder: 'ASC' | 'DESC' = 'DESC', offset?: number, limit = 6) {
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
    return Post.scope({ method: ['category', category] }).findAndCount(options);
}

export function getPostsByTopic(topics: string[], sortOrder: 'ASC' | 'DESC' = 'DESC', limit = 6) {
    return Topic.findAll({ where: { slug: { $in: topics } } }).then((topics) => {
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
    return PostCategory.findAndCountAll();
}

export function getPostCategory(categoryId: number) {
    return PostCategory.findOne({ where: { id: categoryId } });
}