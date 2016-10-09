'use strict';

import * as moment from 'moment';
import * as Sequelize from 'sequelize';
import { database, columnExists, sqlAttribute, createSlug } from '../database';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return queryInterface.renameColumn('topics', 'Name', 'topic')
            .then(() => {
                return queryInterface.removeColumn('topics', 'Created');
            })
            .then(() => {
                return queryInterface.removeColumn('topics', 'Updated');
            })
            .then(() => {
                return queryInterface.addColumn('topics', 'slug', { type: DataTypes.STRING, allowNull: false, defaultValue: 'slug' });
            })
            .then(() => {
                return database.query(`SELECT ${sqlAttribute('id')}, ${sqlAttribute('topic')} FROM topics`, { type: database.QueryTypes.SELECT }).then((results) => {
                    let queue: any[] = [];
                    results.forEach((t: { id: number; topic: string; }) => {
                        let slug = createSlug(t.topic);
                        queue.push(database.query(`UPDATE topics SET ${sqlAttribute('slug')} = '${slug}' WHERE ${sqlAttribute('id')} = ${t.id}`));
                    });
                    return Promise.all(queue);
                });
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};