'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { generateJWT } from '../commands/user.commands';

authenticate.method = 'POST';
authenticate.route = '/api/authenticate';
export function authenticate(request: hapi.Request, reply: hapi.IReply) {
    const { username, password } = request.payload || { username: undefined, password: undefined };

    generateJWT({ username, password })
        .then((token)=> {
            reply({ token });
        }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(400, err.message));
        }
    });
}

getAuth.route = '/api/authenticate';
export function getAuth(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}