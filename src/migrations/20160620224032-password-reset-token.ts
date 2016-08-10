'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return queryInterface.addColumn('users', 'resetPasswordToken', Sequelize.STRING)
            .then(() => {
                return queryInterface.addColumn('users', 'resetPasswordTokenExpires', { type: Sequelize.DATE, allowNull: true });   
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};