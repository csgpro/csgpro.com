import * as Sequelize from 'sequelize';
import { sequelize } from '../database';
import { Post, IPostInstance, IPostAttributes } from './post.model';

export interface ITopicAttributes {
    id: number,
    topic: string;
    slug: string;
    posts?: IPostInstance[]
}

export interface ITopicInstance extends Sequelize.Instance<ITopicAttributes> {
    getPosts: Sequelize.HasManyGetAssociationsMixin<IPostInstance>;
    setPosts: Sequelize.HasManySetAssociationsMixin<IPostInstance, number>;
    addPosts: Sequelize.HasManyAddAssociationsMixin<IPostInstance, number>;
    addPost: Sequelize.HasManyAddAssociationMixin<IPostInstance, number>;
    createPost: Sequelize.HasManyCreateAssociationMixin<IPostAttributes>;
    removePost: Sequelize.HasManyRemoveAssociationMixin<IPostInstance, number>;
    hasPost: Sequelize.HasManyHasAssociationMixin<IPostInstance, number>;
    hasPosts: Sequelize.HasManyHasAssociationsMixin<IPostInstance, number>;
    countPosts: Sequelize.HasManyCountAssociationsMixin;
};

let TopicSchema: Sequelize.DefineAttributes = {
    topic: { type: Sequelize.STRING, unique: true, allowNull: false },
    slug: { type: Sequelize.STRING, unique: true, allowNull: false }
};

let TopicSchemaOptions: Sequelize.DefineOptions<ITopicInstance> = {
    timestamps: false
};

export let Topic = sequelize.define<ITopicInstance, ITopicAttributes> ('topic', TopicSchema, TopicSchemaOptions);