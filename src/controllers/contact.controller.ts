'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { sendContactFormEmail } from '../commands/mail.commands';

export function create(request: hapi.Request, reply: hapi.IReply) {
    let { name, phone, email, note } = request.payload;
    sendContactFormEmail({ name, phone, email, note })
        .then(info => {
            reply({ message: 'Message Sent' });
        }, err => {
            let error = boom.badData();
            error.output.payload.errors = err.errors;
            reply(error);
        });
}