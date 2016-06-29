'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { addContactRequest } from '../commands/contact.commands';
import { sendContactFormEmail } from '../commands/mail.commands';
import { pageView } from '../modules/view-matcher';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view(pageView('contact'),
        {
            title: 'Contact Us',
            description: ''
        },
        { layout: 'hero-layout' });
}

export function create(request: hapi.Request, reply: hapi.IReply) {
    let { name, phone, email, note, company } = request.payload;
    let contact = { fullName: name, phone, email, company };

    addContactRequest(contact, note)
        .then(() => {
            return sendContactFormEmail({ name, phone, email, note });
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