'use strict';

import * as moment from 'moment';
import * as Sequelize from 'sequelize';
import { database, columnExists, sqlAttribute, NOW } from '../database';
import { roleByName } from '../modules/roles';

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        let dateColumnConfig: Sequelize.DefineAttributeColumnOptions = {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: NOW
        };
        
        return queryInterface.addColumn('users', 'roleId', { type: DataTypes.INTEGER, allowNull: false, defaultValue: roleByName.USER })
            .then(() => {
                return queryInterface.addColumn('users', 'password', { type: DataTypes.STRING, allowNull: false, defaultValue: 'no password given' });
            })
            .then(() => {
                return queryInterface.addColumn('users', 'firstName', DataTypes.STRING);
            })
            .then(() => {
                return queryInterface.addColumn('users', 'lastName', DataTypes.STRING);
            })
            .then(() => {
                return queryInterface.addColumn('users', 'createdAt', dateColumnConfig);
            })
            .then(() => {
                return queryInterface.addColumn('users', 'updatedAt', dateColumnConfig);
            })
            .then(() => {
                return queryInterface.renameColumn('users', 'Username', 'username');
            })
            .then(() => {
                return queryInterface.renameColumn('users', 'TwitterHandle', 'twitterHandle');
            })
            .then(() => {
                return queryInterface.renameColumn('users', 'ProfileUrl', 'profilePhotoUrl');
            })
            .then(() => {
                let selectUsers: string = `SELECT ${sqlAttribute('id')}, ${sqlAttribute('twitterHandle')}, ${sqlAttribute('IsAdmin')}, ${sqlAttribute('CreateDate')}, ${sqlAttribute('UpdateDate')}, ${sqlAttribute('FullName')} FROM users`;
                return database.query(selectUsers, { type: database.QueryTypes.SELECT }).then((results) => {
                    let queue: any[] = [];
                    if (results && results.length) {
                        results.forEach((user: any) => {
                            let sets: string[] = [];
                            
                            if (user.twitterHandle && /^@/.test(user.twitterHandle)) {
                                let handle: string = user.twitterHandle;
                                sets.push(`${sqlAttribute('twitterHandle')} = '${handle.substr(1)}'`);
                            }
                            
                            if (user.IsAdmin) {
                                sets.push(`${sqlAttribute('roleId')} = ${roleByName.ADMIN}`);
                            }
                            
                            if (user.FullName) {
                                let fullName: string = user.FullName;
                                let firstName = (fullName.indexOf(' ') > -1) ? fullName.substr(0, fullName.indexOf(' ')) : fullName;
                                let lastName = (fullName.indexOf(' ') > -1) ? fullName.substr(fullName.indexOf(' ') + 1) : '';
                                if (firstName) {
                                    sets.push(`${sqlAttribute('firstName')} = '${firstName}'`);
                                }
                                if (lastName) {
                                    sets.push(`${sqlAttribute('lastName')} = '${lastName}'`);
                                }
                            }
                            
                            if (user.CreateDate) {
                                let createdAt = moment(Number(user.CreateDate)).format('YYYY-MM-DD');
                                sets.push(`${sqlAttribute('createdAt')} = '${createdAt}'`);
                            }
                            
                            if (user.UpdateDate) {
                                let updatedAt = moment(Number(user.UpdateDate)).format('YYYY-MM-DD');
                                sets.push(`${sqlAttribute('updatedAt')} = '${updatedAt}'`);
                            }
                            
                            if (sets.length) {
                                let setValues = sets.join(', ');
                                let query = database.query(`UPDATE users SET ${setValues} WHERE ${sqlAttribute('id')} = ${user.id}`);
                                queue.push(query);
                            }
                        });
                    }
                    return Promise.all(queue);
                });
            })
            .then(() => {
                return queryInterface.removeColumn('users', 'IsAdmin');
            })
            .then(() => {
                return queryInterface.removeColumn('users', 'FullName');
            })
            .then(() => {
                return queryInterface.removeColumn('users', 'CreateDate');
            })
            .then(() => {
                return queryInterface.removeColumn('users', 'UpdateDate');
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};