// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, config, Controller } from 'hapi-decorators';

// app
import { addContactRequest } from '../commands/contact.commands';
import { sendContactFormEmail } from '../commands/mail.commands';
import { pageView } from '../shared/utility';

@controller('/contact')
class ContactController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        reply.view(pageView('contact'),
            {
                title: 'Contact Us',
                description: ''
            },
            { layout: 'hero-layout' });
    }

    @post('/')
    create(request: hapi.Request, reply: hapi.IReply) {
        let { name, phone, email, note, company } = request.payload;
        let contact = { fullName: name, phone, email, company };

        addContactRequest(contact, note)
            .then(() => {
                return sendContactFormEmail({ name, phone, email, note, company });
            })
            .then(() => {
                reply({ message: 'Message Sent' });
            })
            .catch((errors) => {
                let error = boom.badData();
                error.reformat();
                error.output.payload.errors = errors;
                reply(error);
            });
    }
}

export default new ContactController();