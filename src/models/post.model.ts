'use strict';

import * as Sequelize from 'sequelize';
import { sequelize } from '../database';
import { Topic, ITopicModel } from './topic.model';
import { PostCategory, IPostCategoryModel } from './post-category.model';
import { User, IUserModel } from './user.model';

let PostTopic = sequelize.define('postTopic', {}, { timestamps: false });

interface IPostSchema extends Sequelize.DefineAttributes {
    title: Sequelize.DefineAttributeColumnOptions;
    post: Sequelize.DefineAttributeColumnOptions;
    excerpt: Sequelize.DefineAttributeColumnOptions;
    slug: Sequelize.DefineAttributeColumnOptions;
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
    publishedAt: Date;
    author: IUserModel;
    topics: ITopicModel[];
    category: IPostCategoryModel;
}

export interface PostInstance extends Sequelize.Instance<IPostSchema>, IPostModel { };

var PostSchema: IPostSchema = {
    title: { type: Sequelize.STRING, allowNull: false },
    post: { type: Sequelize.TEXT, allowNull: false },
    excerpt: { type: Sequelize.TEXT, allowNull: false },
    slug: { type: Sequelize.STRING, unique: true, allowNull: false },
    publishedAt: Sequelize.DATE
};

var PostSchemaOptions: Sequelize.DefineOptions<PostInstance> = {
    instanceMethods: {},
    hooks: {
        beforeFind: function postsBeforeFind(options:any, fn:any) {
            let topicAttributes: any = { exclude: ['id'] };
            options.include = [
                { model: Topic, through: { attributes: [] }, attributes: topicAttributes },
                { model: PostCategory, as: 'category', attributes: { exclude: ['id'] } },
                { model: User, as: 'author', attributes: { exclude: ['id', 'password', 'roleId'] } }
            ];
            fn(null, options);
        }
    }
};

export var Post: Sequelize.Model<PostInstance, any> = sequelize.define('post', PostSchema, PostSchemaOptions);

Post.belongsToMany(Topic, { through: PostTopic });
Topic.belongsToMany(Post, { through: PostTopic });
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Post.belongsTo(PostCategory, { as: 'category', foreignKey: 'categoryId' });