'use strict';

import * as Sequelize from 'sequelize';
import { database } from '../database';
import { User } from './user.model';
import { Post, IPostInstance } from './post.model';
import { Topic } from './topic.model';

export interface IPostCategoryAttributes {
    id: number,
    category: string;
    slug: string;
    posts?: IPostCategoryInstance[];
}

export interface IPostCategoryInstance extends Sequelize.Instance<IPostCategoryAttributes> {
    getPosts: Sequelize.HasManyGetAssociationsMixin<IPostInstance>;
    setPosts: Sequelize.HasManySetAssociationsMixin<IPostInstance, {}>;
    addPosts: Sequelize.HasManyAddAssociationsMixin<IPostInstance, {}>;
    addPost: Sequelize.HasManyAddAssociationMixin<IPostInstance, {}>;
    createPost: Sequelize.HasManyCreateAssociationMixin<{}>;
    removePost: Sequelize.HasManyRemoveAssociationMixin<IPostInstance, {}>;
    hasPost: Sequelize.HasManyHasAssociationMixin<IPostInstance, {}>;
    hasPosts: Sequelize.HasManyHasAssociationsMixin<IPostInstance, {}>;
    countPosts: Sequelize.HasManyCountAssociationsMixin;
};


let PostCategorySchema: Sequelize.DefineAttributes = {
    category: { type: Sequelize.STRING, allowNull: false, unique: true },
    slug: { type: Sequelize.STRING, allowNull: false, unique: 'true' }
}

let PostCategorySchemaOptions: Sequelize.DefineOptions<IPostCategoryInstance> = {
    timestamps: false,
    getterMethods: {
        permalink: function (): string {
            let self: IPostCategoryInstance = this;
            let postCategorySlug = self.getDataValue('slug');
            return `/${postCategorySlug}`;
        }
    }
};

export let PostCategory = database.define<IPostCategoryInstance, IPostCategoryAttributes>('postCategory', PostCategorySchema, PostCategorySchemaOptions);
