'use strict';

import * as moment from 'moment';
import * as Sequelize from 'sequelize';
import { sequelize, sqlAttribute } from '../src/database';
import * as _ from 'lodash';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        let postTopicsAttributes: Sequelize.DefineAttributes = {
            postId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'posts', key: 'id' }
            },
            topicId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: { model: 'topics', key: 'id' }
            }
        };
        return queryInterface.createTable('postTopics', postTopicsAttributes)
            .then(() => {
                let selectTopics: string = `SELECT ${sqlAttribute('id')}, ${sqlAttribute('topic')} FROM topics`;
                return sequelize.query(selectTopics, { type: sequelize.QueryTypes.SELECT }).then((results) => {
                    let topics: { id: number; topic: string }[] = results;
                    let selectPosts: string = `SELECT ${sqlAttribute('id')}, ${sqlAttribute('topics')} FROM posts`;
                    return sequelize.query(selectPosts, { type: sequelize.QueryTypes.SELECT }).then((results) => {
                        var query: string[] = [];
                        if (results && results.length) {
                            results.forEach((post: { id: number; topics: string; }) => {
                                if (post.topics) {
                                    let postTopics: string[] = post.topics.split(',');
                                    postTopics.forEach(t => {
                                        let topic = _.find(topics, { topic: t.trim() });
                                        if (topic) {
                                            let q = `( ${post.id}, ${topic.id} )`;
                                            query.push(q)
                                        }
                                    });
                                }
                                
                            });
                        }
                        if (query.length) {
                            return sequelize.query(`INSERT INTO ${sqlAttribute('postTopics')} ( ${sqlAttribute('postId')}, ${sqlAttribute('topicId')} ) VALUES ` + query.join(', '), { type: sequelize.QueryTypes.INSERT });
                        } else {
                            return Promise.resolve('');
                        }
                    });
                });
            })
            .then(() => {
                return queryInterface.removeColumn('posts', 'topics');
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
}