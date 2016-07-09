'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        queryInterface.addColumn('topics', 'active', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
}