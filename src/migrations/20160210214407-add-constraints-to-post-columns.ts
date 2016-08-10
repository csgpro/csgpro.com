'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return database.query(`UPDATE posts SET ${sqlAttribute('slug')} = CONCAT(${sqlAttribute('slug')}, ${sqlAttribute('id')}) WHERE ${sqlAttribute('slug')} = 'open-position-sales-executive' OR ${sqlAttribute('slug')} = 'slug' OR ${sqlAttribute('slug')} = 'user-adoption-and-roi-go-hand-in-hand'`, { type: Sequelize.QueryTypes.UPDATE })
            .then(() => {
                return database.query(`ALTER TABLE posts ADD UNIQUE (${sqlAttribute('slug')})`);
            })
            .then(() => {
                return queryInterface.changeColumn('posts', 'title', { type: DataTypes.STRING, allowNull: false });
            })
            .then(() => {
                return queryInterface.changeColumn('posts', 'post', { type: DataTypes.TEXT, allowNull: false });
            })
            .then(() => {
                return database.query(`UPDATE posts SET ${sqlAttribute('excerpt')} = '' WHERE ${sqlAttribute('excerpt')} IS NULL`, { type: Sequelize.QueryTypes.UPDATE });
            })
            .then(() => {
                return queryInterface.changeColumn('posts', 'excerpt', { type: DataTypes.TEXT, allowNull: false });
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};