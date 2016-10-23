// libs
import * as hapi from 'hapi';

// app
import database from '../../database';

export function register(server: hapi.Server, options, next) {
    server.register({
        register: require('hapi-sequelize'),
        options: [
            {
                name: 'db',
                models: ['./server/models/**/*.js'],
                sequelize: database,
                sync: true,
            }
        ]
    });
    next();
};

register['attributes'] = {
    pkg: {name: 'sequelize'}
};