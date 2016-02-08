import * as Umzug from 'umzug';
import { sequelize } from './index';

var umzug: Umzug.Umzug = new Umzug({

    storage: 'sequelize',

    storageOptions: {
        sequelize: sequelize,
    },

    migrations: {
        params: [sequelize.getQueryInterface(), sequelize.constructor, function() {
            throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
        }],
        path: __dirname + '/../../migrations',
        pattern: /\.js$/
    }

});

export function migrate() {
    return umzug.up();
}