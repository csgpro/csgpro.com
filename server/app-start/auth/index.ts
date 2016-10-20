// libs
import {Server} from 'hapi';
import * as moment from 'moment';
import * as jwt from 'hapi-auth-jwt2';

// app
import { Role } from '../../shared/roles';

export const register: any = function register(server: Server, options, next) {
    server.register(jwt);
    server.auth.strategy('jwt', 'jwt', false,
        {
            key: process.env.AUTH_TOKEN_SECRET,
            validateFunc: validate,
            verifyOptions: { algorithms: ['HS256'] }
        });

    next();
};

register.attributes = {
    name: 'Auth',
    version: '1.0.0'
};

function validate({ sub: userId, role, exp }, request, callback) {

    const credentials = {
        scope: [Role[role]],
        userId
    };

    const valid = ((userId > 0) && (exp >= moment().unix()));

    return callback(null, valid, credentials);
};
