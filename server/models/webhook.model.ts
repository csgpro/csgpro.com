'use strict';

import * as Sequelize from 'sequelize';
import { database } from '../database';
import { syncWebhooks } from '../commands/webhook.commands';
import { WebhookEvent, IWebhookEventInstance } from './webhook-event.model';

export interface IWebhookAttributes {
    id: number;
    url: string;
    webhookEvents?: IWebhookEventInstance[];
}

export interface IWebhookInstance extends Sequelize.Instance<IWebhookAttributes> {
    getWebhookEvents: Sequelize.BelongsToManyGetAssociationsMixin<IWebhookEventInstance>;
    setWebhookEvents: Sequelize.BelongsToManySetAssociationsMixin<IWebhookEventInstance, number, void>;
    addWebhookEvents: Sequelize.BelongsToManyAddAssociationsMixin<IWebhookEventInstance, number, void>;
    addWebhookEvent: Sequelize.BelongsToManyAddAssociationMixin<IWebhookEventInstance, number, void>;
    createWebhookEvent: Sequelize.BelongsToManyCreateAssociationMixin<IWebhookEventInstance, void>;
    removeWebhookEvent: Sequelize.BelongsToManyRemoveAssociationMixin<IWebhookEventInstance, number>;
    hasWebhookEvent: Sequelize.BelongsToManyHasAssociationMixin<IWebhookEventInstance, number>;
    hasWebhookEvents: Sequelize.BelongsToManyHasAssociationsMixin<IWebhookEventInstance, number>;
    countWebhookEvents: Sequelize.BelongsToManyCountAssociationsMixin;
};

let WebhookSchema: Sequelize.DefineAttributes = {
    url: { type: Sequelize.STRING, allowNull: false }
};

let WebhookSchemaOptions: Sequelize.DefineOptions<IWebhookInstance> = {
    defaultScope: {
        include: [{ model: WebhookEvent }]
    },
    scopes: {},
    instanceMethods: {},
    getterMethods: {},
    hooks: {
        afterCreate: function (webhook, options: any) {
            if (!options.transaction) {
                syncWebhooks();
            }
        },
        afterDelete: function (webhook, options: any) {
            if (!options.transaction) {
                syncWebhooks();
            }
        }
    },
    timestamps: false
};

export let Webhook = database.define<IWebhookInstance, IWebhookAttributes>('webhook', WebhookSchema, WebhookSchemaOptions);

export let WebhookToEvent = database.define('webhookToEvent', {}, { timestamps: false });

WebhookEvent.belongsToMany(Webhook, { through: WebhookToEvent });
Webhook.belongsToMany(WebhookEvent, { through: WebhookToEvent });