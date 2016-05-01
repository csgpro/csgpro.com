'use strict';

import * as Sequelize from 'sequelize';
import { database } from '../database';
import { Topic, ITopicInstance, ITopicAttributes } from './topic.model';
import { PostCategory, IPostCategoryInstance, IPostCategoryAttributes } from './post-category.model';
import { User, IUserInstance, IUserAttributes } from './user.model';

let PostTopic = database.define('postTopic', {}, { timestamps: false });

export interface IPostAttributes {
    id: number,
    title: string;
    post: string;
    excerpt: string;
    slug: string;
    publishedAt: Date;
    author?: IUserInstance;
    topics?: ITopicInstance[];
    category?: IPostCategoryInstance;
}

export interface IPostInstance extends Sequelize.Instance<IPostAttributes> {
    getTopics: Sequelize.BelongsToManyGetAssociationsMixin<ITopicInstance>;
    setTopics: Sequelize.BelongsToManySetAssociationsMixin<ITopicInstance, number, void>;
    addTopics: Sequelize.BelongsToManyAddAssociationsMixin<ITopicInstance, number, void>;
    addTopic: Sequelize.BelongsToManyAddAssociationMixin<ITopicInstance, number, void>;
    createTopic: Sequelize.BelongsToManyCreateAssociationMixin<ITopicAttributes, void>;
    removeTopic: Sequelize.BelongsToManyRemoveAssociationMixin<ITopicInstance, number>;
    hasTopic: Sequelize.BelongsToManyHasAssociationMixin<ITopicInstance, number>;
    hasTopics: Sequelize.BelongsToManyHasAssociationsMixin<ITopicInstance, number>;
    countTopics: Sequelize.BelongsToManyCountAssociationsMixin;
    getPostCategories: Sequelize.BelongsToManyGetAssociationsMixin<IPostCategoryInstance>;
    setPostCategories: Sequelize.BelongsToManySetAssociationsMixin<IPostCategoryInstance, number, void>;
    addPostCategories: Sequelize.BelongsToManyAddAssociationsMixin<IPostCategoryInstance, number, void>;
    addPostCategory: Sequelize.BelongsToManyAddAssociationMixin<IPostCategoryInstance, number, void>;
    createPostCategory: Sequelize.BelongsToManyCreateAssociationMixin<IPostCategoryAttributes, void>;
    removePostCategory: Sequelize.BelongsToManyRemoveAssociationMixin<IPostCategoryInstance, number>;
    hasPostCategory: Sequelize.BelongsToManyHasAssociationMixin<IPostCategoryInstance, number>;
    hasPostCategories: Sequelize.BelongsToManyHasAssociationsMixin<IPostCategoryInstance, number>;
    countPostCategories: Sequelize.BelongsToManyCountAssociationsMixin;
};

let PostSchema: Sequelize.DefineAttributes = {
    title: { type: Sequelize.STRING, allowNull: false },
    post: { type: Sequelize.TEXT, allowNull: false },
    excerpt: { type: Sequelize.TEXT, allowNull: false },
    slug: { type: Sequelize.STRING, unique: true, allowNull: false },
    publishedAt: Sequelize.DATE
};

let PostSchemaOptions: Sequelize.DefineOptions<IPostInstance> = {
    instanceMethods: {},
    getterMethods: {
        permalink: function (): string {
            let self: IPostInstance = this;
            let permalink: string;
            let postSlug = self.getDataValue('slug');
            let categorySlug = self.getDataValue('category') ? self.getDataValue('category').slug : null;
            let postYear = self.getDataValue('publishedAt').getFullYear();
            let postMonth = ("0" + (self.getDataValue('publishedAt').getMonth() + 1)).slice(-2);

            if (categorySlug === 'career') {
                permalink = `/careers/${postYear}/${postMonth}/${postSlug}`;
            } else if (categorySlug === 'blog') {
                permalink = `/blog/${postYear}/${postMonth}/${postSlug}`;
            } else if (categorySlug === 'news') {
                permalink = `/news/${postYear}/${postMonth}/${postSlug}`;
            } else {
                permalink = `/${categorySlug}/${postSlug}`;
            }
            
            return permalink;
        }
    }
};

export let Post = database.define<IPostInstance, IPostAttributes>('post', PostSchema, PostSchemaOptions);

Post.belongsToMany(Topic, { through: PostTopic });
Topic.belongsToMany(Post, { through: PostTopic });
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Post.belongsTo(PostCategory, { as: 'category', foreignKey: 'categoryId' });
PostCategory.hasMany(Post, { as: 'posts', foreignKey: 'categoryId' });