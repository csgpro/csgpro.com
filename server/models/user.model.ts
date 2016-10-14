'use strict';

import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';
import { database } from '../database';
import { Post, IPostInstance, IPostAttributes } from './post.model';
import { triggerWebhooks, WebhookEvents } from '../commands/webhook.commands';

export interface IUserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    roleId: number;
    firstName: string;
    lastName: string;
    twitterHandle: string;
    profilePhotoUrl: string;
    resetPasswordToken: string;
    resetPasswordTokenExpires: Date;
    posts?: IPostInstance[];
}

export interface IUserInstance extends Sequelize.Instance<IUserAttributes> {
    
    /**
     * Calls save before returning IUserInstance
     * @param  {string} password
     * @returns Promise
     */
    setPassword(password: string): Promise<IUserInstance>;
    validPassword(password: string): boolean;
    generatePasswordResetToken(): Promise<string>;
    getPosts: Sequelize.HasManyGetAssociationsMixin<IPostInstance>;
    setPosts: Sequelize.HasManySetAssociationsMixin<IPostInstance, number>;
    addPosts: Sequelize.HasManyAddAssociationsMixin<IPostInstance, number>;
    addPost: Sequelize.HasManyAddAssociationMixin<IPostInstance, number>;
    createPost: Sequelize.HasManyCreateAssociationMixin<IPostAttributes>;
    removePost: Sequelize.HasManyRemoveAssociationMixin<IPostInstance, number>;
    hasPost: Sequelize.HasManyHasAssociationMixin<IPostInstance, number>;
    hasPosts: Sequelize.HasManyHasAssociationsMixin<IPostInstance, number>;
    countPosts: Sequelize.HasManyCountAssociationsMixin;
};

let UserSchema: Sequelize.DefineAttributes = {
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
    password: { type: Sequelize.STRING, allowNull: false },
    roleId: Sequelize.INTEGER,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    twitterHandle: Sequelize.STRING,
    profilePhotoUrl: Sequelize.STRING,
    resetPasswordToken: Sequelize.STRING,
    resetPasswordTokenExpires: { type: Sequelize.DATE, allowNull: true }
};

let UserSchemaOptions: Sequelize.DefineOptions<IUserInstance> = {
    defaultScope: {
        attributes: [
            'id',
            'email',
            'firstName',
            'lastName',
            'profilePhotoUrl'
        ]
    },
    scopes: {
        private: {
            attributes: [
                'password',
                'twitterHandle',
                'resetPasswordToken',
                'resetPasswordTokenExpires'
            ]
        }
    },
    getterMethods: {
        fullName: function (): string {
            let self: IUserInstance = this;
            let firstName = self.getDataValue('firstName');
            let lastName = self.getDataValue('lastName');
            return `${firstName || ''} ${lastName || ''}`.trim();
        },
        photoUrl: function (): string {
            let self: IUserInstance = this;
            let photoUrl = self.getDataValue('profilePhotoUrl');
            return photoUrl || '/resources/images/author/csg_generic_icon.png';
        }
    },
    setterMethods: {
        fullName: function (value: string): void {
            let self: IUserInstance = this;
            let splitIndex = value.indexOf(' ');
            if (splitIndex === -1) {
                self.setDataValue('firstName', value);
                return;
            }
            let firstName = value.substring(0, splitIndex).trim();
            let lastName = value.substring(splitIndex + 1).trim();
            self.setDataValue('firstName', firstName);
            self.setDataValue('lastName', lastName);
        },
        photoUrl: function (value: string): void {
            let self: IUserInstance = this;
            self.setDataValue('profilePhotoUrl', value);
        }
    },
    instanceMethods: {
        setPassword: function setPasswordFn(password: string) {
            const self: IUserInstance = this;
            if (!password) {
                throw new Error('Password Can\'t Be Null!');
            }

            const salt = bcrypt.genSaltSync();
            const encrypted = bcrypt.hashSync(password, salt);

            self.setDataValue('password', encrypted);

            return self.save();
        },
        validPassword: function validPasswordFn(password: string) {
            const self: IUserInstance = this;

            return bcrypt.compareSync(password, self.getDataValue('password'));
        },
        generatePasswordResetToken: function generatePasswordResetToken() {
            const self: IUserInstance = this;
            let promise = new Promise((resolve, reject) => {
                crypto.randomBytes(20, (err, buffer) => {
                    if (err) reject(err);
                    let token = buffer.toString('hex');
                    let expireDate = new Date().setDate(new Date().getDate() + 2);
                    self.setDataValue('resetPasswordToken', token);
                    self.setDataValue('resetPasswordTokenExpires', expireDate);
                    self.save().then(() => {
                        resolve(token);
                    }).catch(e => reject(e));
                });
            });
            return promise;
        }
    },
    hooks: {
        afterCreate: function (user, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.CreateUser, user.toJSON());
            }
        },
        afterUpdate: function (user, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.UpdateUser, user.toJSON());
            }
        },
        afterDelete: function (user, options: any) {
            if (!options.transaction) {
                triggerWebhooks(WebhookEvents.DeleteUser, user.toJSON());
            }
        }
    }
};

export let User = database.define<IUserInstance, IUserAttributes>('user', UserSchema, UserSchemaOptions);