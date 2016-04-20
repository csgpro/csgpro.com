'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { sendContactFormEmail } from '../commands/mail.commands';

contact.title = 'Contact';
export function contact(request: hapi.Request, reply: hapi.IReply) {
    reply.view('contact', { title: contact.title, description: '' });
}

export function create(request: hapi.Request, reply: hapi.IReply) {
    let { name, phone, email, note } = request.payload;
    sendContactFormEmail({ name, phone, email, note }).then(info => {
        reply({ message: 'Message Sent' });
    }).catch((errors) => {
        let error = boom.badData();
        error.reformat();
        error.output.payload.errors = errors;
        reply(error);
    });
}