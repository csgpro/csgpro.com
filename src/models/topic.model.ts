import * as Sequelize from 'sequelize';
import { sequelize } from '../database';
import { Post, IPostModel } from './post.model';

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
    posts: IPostModel[]
}

export interface TopicInstance extends Sequelize.Instance<ITopicSchema>, ITopicModel { };

var TopicSchema: ITopicSchema = {
    topic: { type: Sequelize.STRING, unique: true, allowNull: false },
    slug: { type: Sequelize.STRING, unique: true, allowNull: false }
};

var TopicSchemaOptions: Sequelize.DefineOptions<TopicInstance> = {
    timestamps: false,
    instanceMethods: {},
    hooks: {
        beforeFind: function postsBeforeFind(options:any, fn:any) {
            let postAttributes: any = ['title', 'slug'];
            options.include = [
                { model: Post, through: { attributes: [] }, attributes: postAttributes },
            ];
            fn(null, options);
        }
    }
};

export var Topic: Sequelize.Model<TopicInstance, any> = sequelize.define('topic', TopicSchema, TopicSchemaOptions);