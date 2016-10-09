// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, put, config, Controller } from 'hapi-decorators';

// app
import { authenticateUser, renewAuthentication } from '../../commands/user.commands';

@controller('/api/authenticate')
class AuthenticateController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @post('/')
    authenticate(request: hapi.Request, reply: hapi.IReply) {
        const { email, password } = request.payload || { email: undefined, password: undefined };

        authenticateUser({ email, password })
            .then((token) => {
                reply({ token });
            }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(400, err.message));
            }
        });
    }

    @put('/')
    @config({ auth: 'jwt' })
    renew(request: hapi.Request, reply: hapi.IReply) {
        const oldToken = request.auth['token'];
        const token = renewAuthentication(oldToken);
        reply({ token });
    }
}

export default new AuthenticateController();