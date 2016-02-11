'use strict';

import * as Sequelize from 'sequelize';
import { sequelize } from '../database';
import { Topic, ITopicModel } from './topic.model';

var PostTopic = sequelize.define('postTopic', {}, { timestamps: false });

interface IPostSchema extends Sequelize.DefineAttributes {
    title: Sequelize.DefineAttributeColumnOptions;
    post: Sequelize.DefineAttributeColumnOptions;
    excerpt: Sequelize.DefineAttributeColumnOptions;
    slug: Sequelize.DefineAttributeColumnOptions;
    authorId: Sequelize.DataTypeAbstract;
    postTypeId: Sequelize.DataTypeAbstract;
    publishedAt: Sequelize.DataTypeAbstract;
}

interface IPostModelOptions {
}

export interface IPostModel extends IPostModelOptions {
    id: number,
    title: string;
    post: string;
    excerpt: string;
    slug: string;
    authorId: number;
    postTypeId: number;
    publishedAt: Date;
    topics: ITopicModel[];
}

export interface PostInstance extends Sequelize.Instance<IPostSchema>, IPostModel { };

var PostSchema: IPostSchema = {
    title: { type: Sequelize.STRING, allowNull: false },
    post: { type: Sequelize.TEXT, allowNull: false },
    excerpt: { type: Sequelize.TEXT, allowNull: false },
    slug: { type: Sequelize.STRING, unique: true, allowNull: false },
    authorId: Sequelize.BIGINT,
    postTypeId: Sequelize.BIGINT,
    publishedAt: Sequelize.DATE
};

var UserSchemaOptions: Sequelize.DefineOptions<PostInstance> = {
    instanceMethods: {},
    hooks: {
        beforeFind: function postsBeforeFind(options:any, fn:any) {
            let topicAttributes: any = { exclude: ['id'] };
            options.include = [
                { model: Topic, through: { attributes: [] }, attributes: topicAttributes },
            ];
            fn(null, options);
        }
    }
};

export var Post: Sequelize.Model<PostInstance, any> = sequelize.define('post', PostSchema, UserSchemaOptions);

Post.belongsToMany(Topic, { through: PostTopic });
Topic.belongsToMany(Post, { through: PostTopic });