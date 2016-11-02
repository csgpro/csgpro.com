// libs
import * as Sequelize from 'sequelize';
import * as Joi from 'joi';

// app
import { Post, IPostInstance, IPostAttributes } from './post.model';

// shared
import * as helpers from '../../shared/helpers';

export interface ITopicAttributes {
    id: number;
    topic: string;
    slug: string;
    active: boolean;
    posts?: IPostInstance[];
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
    slug: { type: Sequelize.STRING, unique: true, allowNull: false },
    active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
};

export const Schema = Joi.object().keys({
    id: Joi.number(),
    topic: Joi.string().required(),
    slug: Joi.string(),
    active: Joi.boolean().default(true)
});

let TopicSchemaOptions: Sequelize.DefineOptions<ITopicInstance> = {
    timestamps: false,
    getterMethods: {
        permalink: function (): string {
            let self: ITopicInstance = this;
            let topicSlug = self.getDataValue('slug');
            return `/topic/${topicSlug}`;
        }
    }
};

export let Topic: Sequelize.Model<ITopicInstance, ITopicAttributes>;

export default function defineModel(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    Topic = sequelize.define<ITopicInstance, ITopicAttributes>('topic', TopicSchema, TopicSchemaOptions);

    Topic['associate'] = function (db) {
        Topic.belongsToMany(db.post, { through: db.postTopic });
    };

    Topic.beforeValidate('createSlug', function (topic, options) {
        topic.setDataValue('slug', helpers.slugify(topic.getDataValue('topic')));
    });

    return Topic;
}