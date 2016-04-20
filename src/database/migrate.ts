import * as Umzug from 'umzug';
import * as Sequelize from 'sequelize';

let umzug: Umzug.Umzug;

export default function (database: Sequelize.Sequelize) {
    umzug = new Umzug({

        storage: 'sequelize',

        storageOptions: {
            sequelize: database,
        },

        migrations: {
            params: [database.getQueryInterface(), database.constructor, function() {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }],
            path: __dirname + '/../../migrations',
            pattern: /\.js$/
        }

    });
    return migrate;
}

function migrate() {
    return umzug.up();
}