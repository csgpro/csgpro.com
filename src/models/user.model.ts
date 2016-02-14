'use strict';

import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt-nodejs';
import { sequelize } from '../database';
import { Post, IPostInstance, IPostAttributes } from './post.model';

export interface IUserAttributes {
    id: number,
    username: string;
    password: string;
    roleId: number;
    firstName: string;
    lastName: string;
    fullName: string;
    twitterHandle: string;
    profilePhotoUrl: string;
    posts?: IPostInstance[];
}

export interface IUserInstance extends Sequelize.Instance<IUserAttributes> {
    setPassword(password: string): Promise<IUserInstance>;
    verifyPassword(password: string): Promise<boolean>;
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
    password: { type: Sequelize.STRING, allowNull: false },
    roleId: Sequelize.INTEGER,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    twitterHandle: Sequelize.STRING,
    profilePhotoUrl: Sequelize.STRING
};

let UserSchemaOptions: Sequelize.DefineOptions<IUserInstance> = {
    getterMethods: {
        fullName: function (): string {
            let self: IUserInstance = this;
            return self.getDataValue('firstName') + ' ' + self.getDataValue('lastName');
        }
    },
    setterMethods: {
        fullName: function (value: string): void {
            let self: IUserInstance = this;
            let splitIndex = value.indexOf(' ');
            let firstName = value.substring(0, splitIndex).trim();
            let lastName = value.substring(splitIndex+1).trim();
            self.setDataValue('firstName', firstName);
            self.setDataValue('lastName', lastName);
        }
    },
    instanceMethods: {
        setPassword: function setPasswordFn(password: string): Promise<IUserInstance> {
            var self: IUserInstance = this;
            if (!password) {
                throw new Error('Password Can\'t Be Null!');
            }
            var promise = new Promise<IUserInstance>((resolve, reject) => {
                return bcrypt.genSalt(10, function (err: Error, salt: string) {
                    return bcrypt.hash(password, salt, function (err: Error, encrypted: string) {
                        self.setDataValue('password', encrypted);
                        self.save().then(() => {
                            resolve(self);
                        });
                    });
                });
            });
            return promise;
        },
        verifyPassword: function verifyPasswordFn(password: string) {
            var self: IUserInstance = this;
            var promise = new Promise((resolve, reject) => {
                bcrypt.compare(password, self.get('password'), function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
            return promise;
        }
    }
};

export let User = sequelize.define<IUserInstance, IUserAttributes>('user', UserSchema, UserSchemaOptions);