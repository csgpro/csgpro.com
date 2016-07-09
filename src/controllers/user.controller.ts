'use strict';

// libs
import * as boom from 'boom';
import * as hapi from 'hapi';

// application
import { requestResetPasswordToken, resetPassword } from '../commands/user.commands';

resetUserPassword.method = 'POST';
resetUserPassword.route = '/api/resetpassword';
export function resetUserPassword(request: hapi.Request, reply: hapi.IReply) {
    const { email, password, token } = request.payload || { email: undefined, password: undefined, token: undefined };
    const host = request.headers['host'];
    
    let command: any;

    if (!token) {
        command = requestResetPasswordToken(email, host).then(() => {
            reply({ message: 'Request Sent' });
        });
    } else {
        command = resetPassword(token, password).then(() => {
            reply({ message: 'Password Saved' });
        });
    }

    command.catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(400, err.message));
        }
    });
}