import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt';
import { sequelize } from '../database';

interface IUserSchema extends Sequelize.DefineAttributes {
    username: Sequelize.DefineAttributeColumnOptions;
    password: Sequelize.DefineAttributeColumnOptions;
    roleId: Sequelize.DataTypeAbstract;
    firstName: Sequelize.DataTypeAbstract;
    lastName: Sequelize.DataTypeAbstract;
    twitterHandle: Sequelize.DataTypeAbstract;
    profilePhotoUrl: Sequelize.DataTypeAbstract;
}

interface IUserModelOptions {
    setPassword(password: string): Promise<UserInstance>;
    verifyPassword(password: string): Promise<boolean>;
    generatePasswordResetToken(): Promise<string>;
}

export interface IUserModel extends IUserModelOptions {
    id: number,
    username: string;
    password: string;
    roleId: number;
    firstName: string;
    lastName: string;
    twitterHandle: string;
    profilePhotoUrl: string;
}

export interface UserInstance extends Sequelize.Instance<IUserSchema>, IUserModel { };

var UserSchema: IUserSchema = {
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    roleId: Sequelize.INTEGER,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    twitterHandle: Sequelize.STRING,
    profilePhotoUrl: Sequelize.STRING
};

var UserSchemaOptions: Sequelize.DefineOptions<UserInstance> = {
    instanceMethods: {
        setPassword: function setPasswordFn(password: string): Promise<UserInstance> {
            var self: UserInstance = this;
            if (!password) {
                throw new Error('Password Can\'t Be Null!');
            }
            var promise = new Promise<UserInstance>((resolve, reject) => {
                return bcrypt.genSalt(10, function (err: Error, salt: string) {
                    return bcrypt.hash(password, salt, function (err: Error, encrypted: string) {
                        self.password = encrypted;
                        self.save().then(() => {
                            resolve(self);
                        });
                    });
                });
            });
            return promise;
        },
        verifyPassword: function verifyPasswordFn(password: string) {
            var self: UserInstance = this;
            var promise = new Promise((resolve, reject) => {
                bcrypt.compare(password, self.password, function(err, res) {
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

export var User: Sequelize.Model<UserInstance, any> = sequelize.define('user', UserSchema, UserSchemaOptions);