'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        queryInterface.changeColumn('users', 'username', { type: DataTypes.STRING, allowNull: false, unique: true });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};