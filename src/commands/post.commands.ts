'use strict';

import * as Sequelize from 'sequelize';
import { User } from '../models/user.model';
import { Topic, ITopicInstance } from '../models/topic.model';
import { Post, IPostInstance } from '../models/post.model';
import { PostCategory } from '../models/post-category.model';
import * as _ from 'lodash';

export function getPost(postSlug: string, categorySlug: string) {
    return Post.findOne({ where: { slug: postSlug } }).then(post => {
        if (!post || (post.getDataValue('category').slug !== categorySlug)) {
            return;
        } else {
            return post;
        }
    });
}

export function getTopics() {
    return Topic.findAll();
}

export function getTopic(topic: string, sortOrder: 'ASC' | 'DESC' = 'DESC') {
    return Topic.findOne({ where: { slug: topic }}).then(t => {
        return t.getPosts({
            where: { publishedAt: { $gt: new Date('1993-01-01') } },
            order: [[ 'publishedAt', sortOrder]],
            include: [{ model: User, as: 'author' }, { model: Topic, as: 'topics' }, { model: PostCategory, as: 'category' }]
        })
            .then(posts => {
                let topics = _.sortBy(_.uniqWith(_.flatten(_.map<IPostInstance, ITopicInstance[]>(posts, 'topics').map(topics => {
                    return topics.map(t => {
                        if (t.getDataValue('slug') !== topic) { // exclude the current topic
                            return t.toJSON();
                        }
                    });
                })), _.isEqual), 'topic');
                
                return { posts, topic: t.getDataValue('topic'), topics };
            });
    });
}

export function getCategory(category: string, sortOrder: 'ASC' | 'DESC' = 'DESC', limit = 6) {
    return PostCategory.findOne({ where: { slug: category }}).then(c => {
        return c.getPosts({
            where: { publishedAt: { $gt: new Date('1993-01-01') } },
            order: [[ 'publishedAt', sortOrder]],
            include: [{ model: User, as: 'author' }, { model: Topic, as: 'topics' }, { model: PostCategory, as: 'category' }],
            limit
        })
            .then(posts => {
                let topics = _.sortBy(_.uniqWith(_.flatten(_.map<IPostInstance, ITopicInstance[]>(posts, 'topics').map(topics => {
                    return topics.map(topic => {
                        return topic.toJSON();
                    });
                })), _.isEqual), 'topic');
                
                return { posts, topics };
            });
    });
}