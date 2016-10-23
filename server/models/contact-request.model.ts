// libs
import * as Sequelize from 'sequelize';

// app
import { Contact, IContactInstance } from './contact.model';
import { triggerWebhooks, WebhookEvents } from '../commands/webhook.commands';

export interface IContactRequestAttributes {
    id?: number;
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
    setterMethods: {},
    hooks: {
        afterCreate: function (cr, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.ContactRequest, cr.toJSON());
            }
        }
    }
};

export let ContactRequest: Sequelize.Model<IContactRequestInstance, IContactRequestAttributes>;

export default function defineModel(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    ContactRequest = sequelize.define<IContactRequestInstance, IContactRequestAttributes>('contactRequest', ContactRequestSchema, ContactRequestSchemaOptions);

    ContactRequest['associate'] = function (db) {
        ContactRequest.belongsTo(db.contact);
    };

    return ContactRequest;
}