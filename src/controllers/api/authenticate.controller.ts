'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { authenticateUser, renewAuthentication } from '../../commands/user.commands';

authenticate.method = 'POST';
authenticate.route = '/api/authenticate';
export function authenticate(request: hapi.Request, reply: hapi.IReply) {
    const { email, password } = request.payload || { email: undefined, password: undefined };

    authenticateUser({ email, password })
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

renew.method = 'PUT';
renew.route = '/api/authenticate';
renew.auth = 'jwt';
export function renew(request: hapi.Request, reply: hapi.IReply) {
    const oldToken = request.auth['token'];
    const token = renewAuthentication(oldToken);
    reply({ token });
}