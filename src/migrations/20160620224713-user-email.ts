'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        queryInterface.addColumn('users', 'email', { type: Sequelize.STRING, allowNull: false, defaultValue: '' }).then(() => {
            queryInterface.sequelize.query(`
                UPDATE users SET users.email = CONCAT(users.username, '@csgpro.com')
            `);
        });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};