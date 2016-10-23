// libs
import * as Sequelize from 'sequelize';
import * as crypto from 'crypto';

// app
import { Contact, IContactInstance } from './contact.model';
import { triggerWebhooks, WebhookEvents } from '../commands/webhook.commands';

export interface IDownloadRequestAttributes {
    id?: number;
    token?: string;
    downloadCount?: number;
    filePath?: string;
    contact?: IContactInstance;
}

export interface IDownloadRequestInstance extends Sequelize.Instance<IDownloadRequestAttributes> {
    getContact: Sequelize.BelongsToGetAssociationMixin<IContactInstance>;
    setContact: Sequelize.BelongsToSetAssociationMixin<IContactInstance, number>;
    createContact: Sequelize.BelongsToCreateAssociationMixin<IContactInstance>;
};

let DownloadRequestSchema: Sequelize.DefineAttributes = {
    token: Sequelize.STRING,
    downloadCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    filePath: Sequelize.STRING
};

let DownloadRequestSchemaOptions: Sequelize.DefineOptions<IDownloadRequestInstance> = {
    instanceMethods: {},
    getterMethods: {},
    setterMethods: {},
    hooks: {
        beforeCreate: (downloadRequest, options) => {
            let buffer = crypto.randomBytes(20);
            let token = buffer.toString('hex');
            downloadRequest.setDataValue('token', token);
        },
        afterCreate: function (dr, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.DownloadRequest, dr.toJSON());
            }
        }
    }
};

export let DownloadRequest: Sequelize.Model<IDownloadRequestInstance, IDownloadRequestAttributes>;

export default function defineModel(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    DownloadRequest = sequelize.define<IDownloadRequestInstance, IDownloadRequestAttributes>('downloadRequest', DownloadRequestSchema, DownloadRequestSchemaOptions);

    DownloadRequest['associate'] = function (db) {
        DownloadRequest.belongsTo(db.contact);
    };

    return DownloadRequest;
}