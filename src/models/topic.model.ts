import * as Sequelize from 'sequelize';
import { sequelize } from '../database';

interface ITopicSchema extends Sequelize.DefineAttributes {
    topic: Sequelize.DefineAttributeColumnOptions;
    slug: Sequelize.DefineAttributeColumnOptions;
}

interface ITopicModelOptions {
}

export interface ITopicModel extends ITopicModelOptions {
    id: number,
    topic: string;
    slug: string;
}

export interface TopicInstance extends Sequelize.Instance<ITopicSchema>, ITopicModel { };

var TopicSchema: ITopicSchema = {
    topic: { type: Sequelize.STRING, unique: true, allowNull: false },
    slug: { type: Sequelize.STRING, unique: true, allowNull: false }
};

var TopicSchemaOptions: Sequelize.DefineOptions<TopicInstance> = {
    timestamps: false,
    instanceMethods: {}
};

export var Topic: Sequelize.Model<TopicInstance, any> = sequelize.define('topic', TopicSchema, TopicSchemaOptions);