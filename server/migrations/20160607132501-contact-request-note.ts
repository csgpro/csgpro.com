'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return queryInterface.changeColumn('contactRequests', 'note', Sequelize.TEXT);
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};