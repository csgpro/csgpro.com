// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, put, config, route, Controller } from 'hapi-decorators';

// app
import { getUsers, getUser } from '../../commands/user.commands';
import { requestResetPasswordToken, resetPassword } from '../../commands/user.commands';

@controller('/api/user')
class UserController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({
        auth: 'jwt'
    })
    getUsersApi(request: hapi.Request, reply: hapi.IReply) {
        getUsers().then(users => {
            reply({ data: users });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }

    @get('/{id}')
    @config({
        auth: 'jwt'
    })
    getUserApi(request: hapi.Request, reply: hapi.IReply) {
        let userId = +request.params['id'];
        getUser(userId).then(user => {
            if (!user) {
                reply(boom.notFound());
                return;
            }
            reply({ data: user.toJSON() });
        });
    }

    @post('/')
    @config({
        auth: 'jwt'
    })
    createUserApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }


    @put('/{id}')
    @config({
        auth: 'jwt'
    })
    updateUserApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @route('delete', '/{id}')
    @config({
        auth: 'jwt'
    })
    deleteUserApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @post('/resetpassword')
    resetUserPassword(request: hapi.Request, reply: hapi.IReply) {
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
}

export default new UserController();