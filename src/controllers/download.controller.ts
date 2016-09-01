'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { addDownloadRequest, getDownloadRequest } from '../commands/contact.commands';
import { sendDownloadEmail } from '../commands/mail.commands';
import { pageView } from '../modules/view-matcher';
import { getProtocolByHost } from '../modules/utility';
import * as path from 'path';

download.route = '/download/{token?}';
export function download(request: hapi.Request, reply: hapi.IReply) {
    let token: string = request.params['token'];

    getDownloadRequest(token)
        .then((file) => {
            let filename = path.basename(file);
            let options: any = { mode: 'attachment', filename, lookupCompressed: false, confine: false };
            reply.file(file, options);
        })
        .catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
}

create.route = '/download/request';
export function create(request: hapi.Request, reply: hapi.IReply) {
    let { name, phone, email, company, filePath } = request.payload;
    let contact = { fullName: name, phone, email, company };
    let fullFilePath = `/downloads/${filePath}`;

    addDownloadRequest(contact, fullFilePath)
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
