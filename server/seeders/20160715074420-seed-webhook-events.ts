'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';
import { WebhookEvent } from '../models/webhook-event.model';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return WebhookEvent.sync()
            .then(() => {
                WebhookEvent.bulkCreate([
                    {
                        id: 1,
                        event: 'CreatePost'
                    },
                    {
                        id: 2,
                        event: 'UpdatePost'
                    },
                    {
                        id: 3,
                        event: 'DeletePost'
                    },
                    {
                        id: 4,
                        event: 'PublishPost'
                    },
                    {
                        id: 5,
                        event: 'CreateUser'
                    },
                    {
                        id: 6,
                        event: 'UpdateUser'
                    },
                    {
                        id: 7,
                        event: 'DeleteUser'
                    },
                    {
                        id: 8,
                        event: 'CreateStory'
                    },
                    {
                        id: 9,
                        event: 'UpdateStory'
                    },
                    {
                        id: 10,
                        event: 'DeleteStory'
                    },
                    {
                        id: 11,
                        event: 'ContactRequest'
                    },
                    {
                        id: 12,
                        event: 'DownloadRequest'
                    }
                ]);
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};