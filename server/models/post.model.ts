// libs
import * as Sequelize from 'sequelize';

// app
import { Topic, ITopicInstance, ITopicAttributes } from './topic.model';
import { PostCategory, IPostCategoryInstance, IPostCategoryAttributes } from './post-category.model';
import { User, IUserInstance, IUserAttributes } from './user.model';
import { triggerWebhooks, WebhookEvents } from '../commands/webhook.commands';

export interface IPostAttributes {
    id: number;
    title: string;
    post: string;
    excerpt: string;
    slug: string;
    publishedAt: Date;
    author?: IUserInstance;
    topics?: ITopicInstance[];
    category?: IPostCategoryInstance;
    permalink: string;
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
    scopes: {
        list: function (published = true, categorySlug?: string, sortOrder = 'DESC'): any {
            let options: any = {
                attributes: ['id', 'title', 'slug', 'excerpt', 'publishedAt', 'authorId', 'categoryId' ],
                include: [{ model: User, as: 'author' }, { model: PostCategory, as: 'category' }],
                order: [[ 'publishedAt', sortOrder ]]
            };
            if (published) {
                options.where = { publishedAt: { $gt: new Date('1993-01-01') } };
            }
            if (categorySlug) {
                // Add 'where' clause to PostCategory include
                options.include[1].where = { slug: categorySlug };
            }
            return options;
        }
    },
    instanceMethods: {},
    getterMethods: {
        permalink: function (): string {
            let self: IPostInstance = this;

            if (!self.getDataValue('publishedAt')) return;

            let permalink: string;
            let postSlug = self.getDataValue('slug');
            let categorySlug = self.getDataValue('category') ? self.getDataValue('category').slug : null;
            let postYear = self.getDataValue('publishedAt').getFullYear();
            let postMonth = ('0' + (self.getDataValue('publishedAt').getMonth() + 1)).slice(-2);

            if (categorySlug === 'career') {
                permalink = `/careers/${postYear}/${postMonth}/${postSlug}`;
            } else if (categorySlug === 'blog') {
                permalink = `/blog/${postYear}/${postMonth}/${postSlug}`;
            } else if (categorySlug === 'news') {
                // TODO: Update to 'events' categorySlug when db migration is complete.
                permalink = `/events/${postYear}/${postMonth}/${postSlug}`;
            } else {
                permalink = `/${categorySlug}/${postSlug}`;
            }
            
            return permalink;
        }
    },
    hooks: {
        afterCreate: function (post, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.CreatePost, post.toJSON());
            }
        },
        afterUpdate: function (post, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.UpdatePost, post.toJSON());
            }
        },
        afterDelete: function (post, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.DeletePost, post.toJSON());
            }
        }
    }
};

export let Post: Sequelize.Model<IPostInstance, IPostAttributes>;

export default function defineModel(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    Post = sequelize.define<IPostInstance, IPostAttributes>('post', PostSchema, PostSchemaOptions);

    Post['associate'] = function (db) {
        Post.belongsToMany(db.topic, { through: db.postTopic });
        Post.belongsTo(db.user, { as: 'author', foreignKey: 'authorId' });
        Post.belongsTo(db.postCategory, { as: 'category', foreignKey: 'categoryId' });
    };

    return Post;
}
