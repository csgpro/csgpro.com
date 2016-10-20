// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import * as path from 'path';
import { controller, get, post, Controller } from 'hapi-decorators';

// app
import { addDownloadRequest, getDownloadRequest } from '../commands/contact.commands';
import { sendDownloadEmail } from '../commands/mail.commands';
import { pageView } from '../shared/utility';
import { getProtocolByHost } from '../shared/utility';

@controller('/download')
class DownloadController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/{token?}')
    async download(request: hapi.Request, reply: hapi.IReply) {
        let token: string = request.params['token'];

        try {
            let file = await getDownloadRequest(token);
            reply.redirect(file);
        } catch (err) {
            reply(boom.create(500, err || err.message));
        }
    }

    @post('/request')
    create(request: hapi.Request, reply: hapi.IReply) {
        let { name, phone, email, company, filePath } = request.payload;
        let contact = { fullName: name, phone, email, company };

        addDownloadRequest(contact, filePath)
            .then(dr => {
                let host = request.headers['host'];
                let protocol = getProtocolByHost(host);
                let url = `${protocol}://${host}/download/${dr.toJSON().token}`;
                return sendDownloadEmail(email, url);
            })
            .then(() => {
                reply({ message: 'Download Sent' });
            })
            .catch((errors) => {
                let error = boom.badData();
                error.reformat();
                error.output.payload.errors = errors;
                reply(error);
            });
    }
}

export default new DownloadController();
