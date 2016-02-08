import * as Umzug from 'umzug';
import { sequelize } from './index';

var umzug: Umzug.Umzug = new Umzug({

    storage: 'sequelize',

    storageOptions: {
        sequelize: sequelize,
    },

    migrations: {
        params: [sequelize.getQueryInterface(), sequelize.constructor, function() {
            throw new Error('Seed tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
        }],
        path: __dirname + '/../../seeders',
        pattern: /\.js$/
    }

});

export function seed() {
    return umzug.up();
}