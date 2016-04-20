'use strict';

import * as moment from 'moment';
import * as Sequelize from 'sequelize';
import { database, columnExists, sqlAttribute, NOW, RESTRICT, createSlug } from '../src/database';
import postTypes from '../src/modules/post-types';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        let dateColumnConfig: Sequelize.DefineAttributeColumnOptions = {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: NOW
        };
        
        return queryInterface.addColumn('posts', 'slug', { type: DataTypes.STRING, allowNull: false, defaultValue: 'slug' })
            .then(() => {
                return queryInterface.renameColumn('posts', 'Title', 'title');
            })
            .then(() => {
                return queryInterface.renameColumn('posts', 'Topics', 'topics');
            })
            .then(() => {
                return queryInterface.addColumn('posts', 'authorId', {
                        type: DataTypes.BIGINT,
                        references: { model: 'users', key: 'id' },
                        onUpdate: 'CASCADE',
                        onDelete: RESTRICT,
                        defaultValue: 21 // CSG Pro user
                    });
            })
            .then(() => {
                return queryInterface.renameColumn('posts', 'Abstract', 'excerpt');
            })
            .then(() => {
                return queryInterface.renameColumn('posts', 'Markdown', 'post');
            })
            .then(() => {
                return queryInterface.addColumn('posts', 'postTypeId', { type: DataTypes.BIGINT, allowNull: false, defaultValue: postTypes.BLOG });
            })
            .then(() => {
                return queryInterface.addColumn('posts', 'publishedAt', { type: DataTypes.DATE });
            })
            .then(() => {
                return queryInterface.addColumn('posts', 'createdAt', dateColumnConfig);
            })
            .then(() => {
                return queryInterface.addColumn('posts', 'updatedAt', dateColumnConfig);
            })
            .then(() => {
                let selectPosts: string = `SELECT ${sqlAttribute('id')}, ${sqlAttribute('CreateDate')}, ${sqlAttribute('UpdateDate')}, ${sqlAttribute('PublishDate')}, ${sqlAttribute('title')}, ${sqlAttribute('AuthorUserId')}, ${sqlAttribute('Category')} FROM posts`;
                return database.query(`SELECT ${sqlAttribute('id')} FROM users`, { type: database.QueryTypes.SELECT }).then((results: { id: number }[]) => {
                    var userIds: number[] = results.map(user => user.id);
                    console.info('userIds:', userIds);
                    return database.query(selectPosts, { type: database.QueryTypes.SELECT }).then((results) => {
                        var queue: any[] = [];
                        if (results && results.length) {
                            results.forEach((post: any) => {
                                let sets: string[] = [];
                                
                                if (post.CreateDate) {
                                    let createdAt = moment(Number(post.CreateDate)).format('YYYY-MM-DD');
                                    sets.push(`${sqlAttribute('createdAt')} = '${createdAt}'`);
                                }
                                
                                if (post.UpdateDate) {
                                    let updatedAt = moment(Number(post.UpdateDate)).format('YYYY-MM-DD');
                                    sets.push(`${sqlAttribute('updatedAt')} = '${updatedAt}'`);
                                }
                                
                                if (post.PublishDate) {
                                    let publishedAt = moment(Number(post.PublishDate)).format('YYYY-MM-DD');
                                    sets.push(`${sqlAttribute('publishedAt')} = '${publishedAt}'`);
                                }
                                
                                if (post.Category) {
                                    let category: string = post.Category.toUpperCase().trim();
                                    let postTypeId: number;
                                    postTypes[<any>category];
                                    postTypeId = (category === postTypes[<any>postTypes[<any>category]]) ? <any>postTypes[<any>category] : postTypes.BLOG;
                                    sets.push(`${sqlAttribute('postTypeId')} = ${postTypeId}`);
                                }
                                
                                if (post.title) {
                                    let slug = createSlug(post.title);
                                    sets.push(`${sqlAttribute('slug')} = '${slug}'`);
                                }
                                
                                let userId = 21; // CSG Pro (default user)
                                if (post.AuthorUserId && (userIds.indexOf(post.AuthorUserId) > -1)) {
                                    userId = userIds[userIds.indexOf(post.AuthorUserId)];
                                }
                                sets.push(`${sqlAttribute('authorId')} = ${userId}`);
                                
                                let setValues = sets.join(', ');
                                let query = database.query(`UPDATE posts SET ${setValues} WHERE ${sqlAttribute('id')} = ${post.id}`, { type: database.QueryTypes.UPDATE });
                                queue.push(query);
                            });
                        }
                        return Promise.all(queue);
                    });
                });
            })
            // .then(() => {
            //     return queryInterface.removeColumn('posts', 'AuthorUserId');
            // })
            .then(() => {
                return queryInterface.removeColumn('posts', 'ApproverUserId');
            })
            .then(() => {
                return queryInterface.removeColumn('posts', 'CreateDate');
            })
            .then(() => {
                return queryInterface.removeColumn('posts', 'UpdateDate');
            })
            .then(() => {
                return queryInterface.removeColumn('posts', 'PublishDate');
            })
            .then(() => {
                return queryInterface.removeColumn('posts', 'Category');
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
}