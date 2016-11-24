// libs
import * as Sequelize from 'sequelize';
import database from '../database';
import * as _ from 'lodash';
import * as Joi from 'joi';

// app
import { User } from '../models/user.model';
import { Topic, ITopicInstance, ITopicAttributes, Schema } from '../models/topic.model';
import { Post, IPostInstance, IPostAttributes } from '../models/post.model';
import { PostCategory } from '../models/post-category.model';
import { triggerWebhooks, WebhookEvents } from './webhook.commands';

const topicSchema = Schema;

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

export function getTopics(where: Sequelize.WhereOptions = { active: true }, order = 'topic', hasPublishedPosts = true) {
    let include = (hasPublishedPosts) ? [{ model: Post, through: 'postTopic', where: { 'publishedAt': { $ne: null } } }] : undefined;
    return Topic.findAll({ where, order, include });
}

export function getTopic(topic: string|number) {
    return (typeof topic === 'string') ? Topic.findOne({ where: { slug: topic } }) : Topic.findById(topic);
}

export async function getPostsByCategory(category: string, published = true, sortOrder: 'ASC' | 'DESC' = 'DESC', offset?: number, limit = 6) {
    limit = (isNaN(limit)) ? undefined : +limit;
    offset = (isNaN(offset)) ? undefined : +offset;
    let order = [[ 'publishedAt', sortOrder ]];
    let where: Sequelize.WhereOptions = (published) ? { 'publishedAt': { $ne: null } } : {};

    let postCategory = await PostCategory.findOne({ where: { slug: category } });

    where['categoryId'] = postCategory.getDataValue('id');

    let results = await Post.findAndCountAll({ where, limit, order, offset, include: [{ model: User, as: 'author' }, { model: PostCategory, as: 'category' }] });

    let posts = [...results.rows];

    Object.defineProperty(posts, 'count', {
        value: results.count
    });

    return posts;
}

export async function getPostsByTopic(topic: string, published = true, sortOrder: 'ASC' | 'DESC' = 'DESC', offset?: number, limit = 6) {
    limit = (isNaN(limit)) ? undefined : +limit;
    offset = (isNaN(offset)) ? undefined : +offset;
    let order = [[ 'publishedAt', sortOrder ]];
    let where: Sequelize.WhereOptions = (published) ? { 'publishedAt': { $ne: null } } : {};

    let postTopic = await Topic.findOne({ where: { slug: topic } });

    let postsTotal = await postTopic.countPosts({ where: { 'publishedAt': { $ne: null } } });

    let posts = await postTopic.getPosts(<any>{ 
                include: [{ all: true }],
                where: { 'publishedAt': { $ne: null } },
                order: [[ 'publishedAt', sortOrder ]],
                limit,
                offset
            });

    Object.defineProperty(posts, 'count', {
        value: postsTotal
    });

    return posts;
}

export function getPostCategories() {
    return PostCategory.findAndCountAll().then(data => {
        let categories = [...data.rows];
        Object.defineProperty(categories, 'count', {
            value: data.count
        });
        return categories;
    });
}

export function getPostCategory(categoryId: number) {
    return PostCategory.findOne({ where: { id: categoryId } });
}

export async function savePost(postData: IPostAttributes & IPostInstance): Promise<IPostInstance> {
    let transaction = await database.transaction();

    try {
        postData.authorId = (postData.author) ? postData.author.id : null; // Extract the authorId
        postData.categoryId = (postData.category) ? postData.category.id : null; // Extract the categoryId
        let postInstance = await ((postData.id) ? Post.findById(postData.id, { transaction }).then(p => p.update(postData, { transaction })) : Post.create(postData, { transaction }));
        
        let topics: ITopicAttributes[] = <any>postData.topics || [];

        let topicInstances = await Promise.all(topics.map((t) => {
            return ((t.id) ? Topic.findById(t.id, { transaction }) : Topic.create(t, { transaction }));
        }));

        await postInstance.setTopics(<any>topicInstances, { transaction });

        await transaction.commit();

        return await getPostByPostId(postInstance.getDataValue('id'));
    } catch (exc) {
        await transaction.rollback();
        return await Promise.reject(exc);
    }
}

export async function deletePost(postId: number) {
    try {
        let post = await Post.findById(postId);
        await post.setTopics([]);
        await post.destroy();
        return;
    } catch (exc) {
        return await Promise.reject(exc);
    }
}