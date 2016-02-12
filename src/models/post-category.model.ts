'use strict';

import * as Sequelize from 'sequelize';
import { sequelize } from '../database';
import { Post } from './post.model';

interface IPostCategorySchema extends Sequelize.DefineAttributes {
    category: Sequelize.DefineAttributeColumnOptions;
    slug: Sequelize.DefineAttributeColumnOptions;
}

let PostCategorySchema: IPostCategorySchema = {
    category: { type: Sequelize.STRING, allowNull: false, unique: true },
    slug: { type: Sequelize.STRING, allowNull: false, unique: 'true' }
}

interface IPostCategoryModelOptions {
}

export interface IPostCategoryModel extends IPostCategoryModelOptions {
    id: number,
    category: string;
    slug: string;
}

export interface PostCategoryInstance extends Sequelize.Instance<IPostCategorySchema>, IPostCategoryModel { };

let PostCategorySchemaOptions: Sequelize.DefineOptions<PostCategoryInstance> = {
    timestamps: false
};

export let PostCategory = sequelize.define('postCategory', PostCategorySchema, PostCategorySchemaOptions);

//PostCategory.hasMany(Post);