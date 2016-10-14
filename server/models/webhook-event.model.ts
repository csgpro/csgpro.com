'use strict';

import * as Sequelize from 'sequelize';
import { database } from '../database';
import { IWebhookInstance } from './webhook.model';

export interface IWebhookEventAttributes {
    id: number;
    event: string;
    webhooks?: IWebhookInstance[];
}

export interface IWebhookEventInstance extends Sequelize.Instance<IWebhookEventAttributes> {
    getWebhooks: Sequelize.HasManyGetAssociationsMixin<IWebhookInstance>;
    setWebhooks: Sequelize.HasManySetAssociationsMixin<IWebhookInstance, number>;
    addWebhooks: Sequelize.HasManyAddAssociationsMixin<IWebhookInstance, number>;
    addWebhook: Sequelize.HasManyAddAssociationMixin<IWebhookInstance, number>;
    createWebhook: Sequelize.HasManyCreateAssociationMixin<IWebhookInstance>;
    removeWebhook: Sequelize.HasManyRemoveAssociationMixin<IWebhookInstance, number>;
    hasWebhook: Sequelize.HasManyHasAssociationMixin<IWebhookInstance, number>;
    hasWebhooks: Sequelize.HasManyHasAssociationsMixin<IWebhookInstance, number>;
    countWebhooks: Sequelize.HasManyCountAssociationsMixin;
};

let WebhookEventSchema: Sequelize.DefineAttributes = {
    event: { type: Sequelize.STRING, allowNull: false }
};

let WebhookEventSchemaOptions: Sequelize.DefineOptions<IWebhookEventInstance> = {
    scopes: {},
    instanceMethods: {},
    getterMethods: {},
    hooks: {},
    timestamps: false
};

export let WebhookEvent = database.define<IWebhookEventInstance, IWebhookEventAttributes>('webhookEvent', WebhookEventSchema, WebhookEventSchemaOptions);