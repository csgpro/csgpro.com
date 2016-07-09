'use strict';

import * as Sequelize from 'sequelize';
import { Contact, IContactAttributes, IContactInstance } from '../models/contact.model';
import { ContactRequest, IContactRequestInstance } from '../models/contact-request.model';
import { DownloadRequest, IDownloadRequestInstance } from '../models/download-request.model';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime';

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

export function addDownloadRequest(contact: IContactAttributes, filePath: string) {
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
        return DownloadRequest.create({ filePath: filePath });
    }).then(dr => {
        dr.setContact(contactInstance);
        return dr;
    });
}

export function getDownloadRequest(token: string) {
    return DownloadRequest.findOne({
        where: {
            token
        }
    })
    .then(dr => {
        if (!dr) {
            throw new Error('Invalid Token');
        }
        return dr.increment('downloadCount');
    })
    .then(dr => {
        // Return the file
        let file = __dirname + '/..' + dr.getDataValue('filePath');
        return file;
    });
}

export function getContacts(order = 'createdAt', sortOrder: 'ASC' | 'DESC' = 'DESC', offset?: number, limit = 6, where?: Sequelize.WhereOptions) {
    limit = (isNaN(limit)) ? undefined : +limit;
    offset = (isNaN(offset)) ? undefined : +offset;
    let include;

    if (where) {
        include = [ContactRequest, DownloadRequest];
    }

    return Contact.findAndCountAll({
        limit,
        offset,
        order: [[order, sortOrder]],
        where,
        include
    }).then(data => {
        let contacts = [...data.rows];
        Object.defineProperty(contacts, 'count', {
            value: data.count
        });
        return contacts;
    });
}