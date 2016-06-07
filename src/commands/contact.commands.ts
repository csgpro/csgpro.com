'use strict';

import * as Sequelize from 'sequelize';
import { Contact, IContactAttributes, IContactInstance } from '../models/contact.model';
import { ContactRequest, IContactRequestInstance } from '../models/contact-request.model';

export function addContactRequest(contact: IContactAttributes, note: string) {
    let { email } = contact;
    let contactInstance: IContactInstance;
    delete contact.email;
    return Contact.findOrCreate({
        where: {
            email: email
        },
        defaults: contact
    }).then(([c, created]) => {
        return c.update(contact);
    }).then((c: IContactInstance) => {
        contactInstance = c;
        return ContactRequest.create({
            note
        });
    }).then(cr => {
        cr.setContact(contactInstance);
        return cr;
    });
}