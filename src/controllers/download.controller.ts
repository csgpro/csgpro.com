'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { addDownloadRequest, getDownloadRequest } from '../commands/contact.commands';
import { sendDownloadEmail } from '../commands/mail.commands';
import { pageView } from '../modules/view-matcher';
import * as path from 'path';

download.route = '/download/{token?}';
export function download(request: hapi.Request, reply: hapi.IReply) {
    let token: string = request.params['token'];

    getDownloadRequest(token)
        .then((file) => {
            let filename = path.basename(file);
            reply.file(file, { mode: 'attachment', filename, lookupCompressed: false });
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
            let url = `${request.connection.info.protocol}://${request.headers['host']}/download/${dr.toJSON().token}`;
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
