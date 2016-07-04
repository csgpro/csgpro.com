'use strict';

// hapi
import * as hapi from 'hapi';
import * as boom from 'boom';

// app
import { getContacts } from '../../commands/contact.commands';

getContactsApi.auth = 'jwt';
getContactsApi.route = '/api/contact';
export function getContactsApi(request: hapi.Request, reply: hapi.IReply) {
    let { limit, offset, sort, order } = request.query;
    getContacts(order, sort, offset, limit).then(contacts => {
        reply({ data: contacts });
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}

createContactApi.auth = 'jwt';
createContactApi.method = 'POST';
createContactApi.route = '/api/contact';
export function createContactApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

updateContactApi.auth = 'jwt';
updateContactApi.method = 'PUT';
updateContactApi.route = '/api/contact/{id}';
export function updateContactApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}

updateContactApi.auth = 'jwt';
deleteContactApi.method = 'DELETE';
deleteContactApi.route = '/api/contact/{id}';
export function deleteContactApi(request: hapi.Request, reply: hapi.IReply) {
    reply(boom.notImplemented());
}