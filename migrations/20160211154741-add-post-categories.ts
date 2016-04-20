'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../src/database';
import { PostCategory } from '../src/models/post-category.model';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return PostCategory.sync()
            .then(() => {
                PostCategory.bulkCreate([
                    {
                        id: 1,
                        category: 'Blog',
                        slug: 'blog'
                    },
                    {
                        id: 2,
                        category: 'Career',
                        slug: 'career'
                    },
                    {
                        id: 3,
                        category: 'News',
                        slug: 'news'
                    }
                ])
            })
            .then(() => {
                return queryInterface.addColumn('posts', 'categoryId', { type: DataTypes.BIGINT, allowNull: false, defaultValue: 1 });
            })
            .then(() => {
                return database.query(`UPDATE posts SET ${sqlAttribute('categoryId')} = ${sqlAttribute('postTypeId')}`, { type: Sequelize.QueryTypes.UPDATE });
            })
            .then(() => {
                return queryInterface.removeColumn('posts', 'postTypeId');
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
}