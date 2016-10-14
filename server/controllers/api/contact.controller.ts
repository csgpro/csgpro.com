// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, put, config, route, Controller } from 'hapi-decorators';

// app
import { getContacts } from '../../commands/contact.commands';

@controller('/api/contact')
class ContactController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({
        auth: 'jwt'
    })
    getContactsApi(request: hapi.Request, reply: hapi.IReply) {
        let { limit, offset, sort, order, email } = request.query;
        let where;

        if (email) {
            offset = 0;
            where = { email };
        }

        getContacts(order, sort, offset, limit, where).then(contacts => {
            reply({ data: contacts });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }

    @post('/')
    @config({
        auth: 'jwt'
    })
    createContactApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @put('/{id}')
    @config({
        auth: 'jwt'
    })
    updateContactApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @route('delete', '/{id}')
    @config({
        auth: 'jwt'
    })
    deleteContactApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }
}

export default new ContactController();