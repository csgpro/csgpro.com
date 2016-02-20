'use strict';

import * as Sequelize from 'sequelize';
import { User } from '../models/user.model';
import { Topic } from '../models/topic.model';
import { Post } from '../models/post.model';
import { PostCategory } from '../models/post-category.model';

const include = {
    publishedPosts: {
        model: Post,
        as: 'posts',
        where: { publishedAt: { $gt: new Date('1993-01-01') } },
        attributes: ['title', 'slug', 'excerpt', 'publishedAt'],
        include: [
            { model: PostCategory, as: 'category' },
            { model: Topic, as: 'topics' },
            { model: User, as: 'author' }
        ]
    }
}

export function getPostCategory(categorySlug: string) {
    return PostCategory.findOne({
        where: { slug: categorySlug },
        include: [<any>include.publishedPosts],
        order: [
            [ { model: Post, as: 'posts' }, 'publishedAt', 'DESC' ]
        ]
    });
};

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

export function getTopic(topicSlug: string) {
    return Topic.findOne({
        where: { slug: topicSlug },
        include: [<any>include.publishedPosts],
        order: [
            [ Post, 'publishedAt', 'DESC' ]
        ]
    });
};