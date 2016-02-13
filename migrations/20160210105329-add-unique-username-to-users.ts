'use strict';

import * as Sequelize from 'sequelize';
import { sequelize, sqlAttribute } from '../src/database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return sequelize.query(`ALTER TABLE users ADD UNIQUE (${sqlAttribute('username')})`);
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
}