// libs
import * as Sequelize from 'sequelize';

export interface IContactAttributes {
    id?: number;
    firstName?: string;
    lastName?: string;
    fullName: string; // not mapped
    phone?: string;
    email: string;
    company?: string;
}

export interface IContactInstance extends Sequelize.Instance<IContactAttributes> {};

let ContactSchema: Sequelize.DefineAttributes = {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: { type: Sequelize.STRING, unique: true, validate: { isEmail: true } },
    company: Sequelize.STRING
};

let ContactSchemaOptions: Sequelize.DefineOptions<IContactInstance> = {
    instanceMethods: {},
    getterMethods: {
        fullName: function (): string {
            let self: IContactInstance = this;
            let firstName = self.getDataValue('firstName');
            let lastName = self.getDataValue('lastName');
            return `${firstName || ''} ${lastName || ''}`.trim();
        }
    },
    setterMethods: {
        fullName: function (value: string): void {
            let self: IContactInstance = this;
            let splitIndex = value.indexOf(' ');
            if (splitIndex === -1) {
                self.setDataValue('firstName', value);
                return;
            }
            let firstName = value.substring(0, splitIndex).trim();
            let lastName = value.substring(splitIndex + 1).trim();
            self.setDataValue('firstName', firstName);
            self.setDataValue('lastName', lastName);
        }
    },
};

export let Contact: Sequelize.Model<IContactInstance, IContactAttributes>;

export default function defineModel(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    Contact = sequelize.define<IContactInstance, IContactAttributes>('contact', ContactSchema, ContactSchemaOptions);

    Contact['associate'] = function (db) {
        Contact.hasMany(db.contactRequest);
        Contact.hasMany(db.downloadRequest);
    };

    return Contact;
}
