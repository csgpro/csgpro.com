'use strict';

// libs
import * as boom from 'boom';
import * as hapi from 'hapi';

// application
import { requestResetPasswordToken } from '../commands/user.commands';

resetUserPassword.method = 'POST';
resetUserPassword.route = '/api/resetpassword';
export function resetUserPassword(request: hapi.Request, reply: hapi.IReply) {
    const { email, token } = request.payload || { email: undefined, token: undefined };
    const host = request.headers['host'];
    if (!token) {
        requestResetPasswordToken(email, host).then(() => {
            reply({ message: 'Request Sent' });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(400, err.message));
            }
        });
    } else {
        reply(boom.notImplemented());
    }
}