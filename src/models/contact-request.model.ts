'use strict';

import * as Sequelize from 'sequelize';
import { database } from '../database';
import { Contact, IContactInstance } from './contact.model';

export interface IContactRequestAttributes {
    id?: number,
    note: string;
    contact?: IContactInstance;
}

export interface IContactRequestInstance extends Sequelize.Instance<IContactRequestAttributes> {
    getContact: Sequelize.BelongsToGetAssociationMixin<IContactInstance>;
    setContact: Sequelize.BelongsToSetAssociationMixin<IContactInstance, number>;
    createContact: Sequelize.BelongsToCreateAssociationMixin<IContactInstance>;
};

let ContactRequestSchema: Sequelize.DefineAttributes = {
    note: Sequelize.TEXT
};

let ContactRequestSchemaOptions: Sequelize.DefineOptions<IContactRequestInstance> = {
    instanceMethods: {},
    getterMethods: {},
    setterMethods: {}
};

export let ContactRequest = database.define<IContactRequestInstance, IContactRequestAttributes>('contactRequest', ContactRequestSchema, ContactRequestSchemaOptions);

ContactRequest.belongsTo(Contact);
Contact.hasMany(ContactRequest);