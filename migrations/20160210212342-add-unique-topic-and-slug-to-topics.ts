'use strict';

import * as Sequelize from 'sequelize';
import { sequelize, sqlAttribute } from '../src/database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return sequelize.query(`ALTER TABLE topics ADD UNIQUE (${sqlAttribute('topic')}, ${sqlAttribute('slug')})`);
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
}