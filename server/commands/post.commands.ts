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

export function getTopics(where: Sequelize.WhereOptions = { active: true }, order = 'topic') {
    return Topic.findAndCountAll({ where, order }).then(data => {
        let topics = [...data.rows];
        Object.defineProperty(topics, 'count', {
            value: data.count
        });
        return topics;
    });
}

export async function getTopic(topic: string|number, includePosts = true, sortOrder: 'ASC' | 'DESC' = 'DESC'): Promise<any> {
    let where: any = (typeof topic === 'string') ? { slug: topic } : { id: topic };

    if (includePosts) {
        let topic = await Topic.findOne({ where });
        let posts = await topic.getPosts(<any>{ order: [[ 'publishedAt', sortOrder ]], scope: { method: ['list'] } });

        return [topic, posts];
    } else {
        return await Topic.findOne({ where });
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
    });
}

export function getPostsByTopic(topics: string[], sortOrder: 'ASC' | 'DESC' = 'DESC', limit = 6) {
    return Topic.findAll({
        where: { slug: { $in: topics } },
        include: [{ model: Post.scope({ method: ['list', undefined, undefined, sortOrder] }) }]
    }).then((topics) => {
        let queue = [];
        
        topics.forEach(topic => {
            // TODO: Fix type definitions
            queue.push(topic.getPosts(<any>{
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
        console.error(exc.stack || exc);
        transaction.rollback();
    }
}