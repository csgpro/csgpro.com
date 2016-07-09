'use strict';

// libs
import * as Sequelize from 'sequelize';
import * as JWT from 'jsonwebtoken';
import * as conf from 'nconf';
import * as moment from 'moment';
import * as _ from 'lodash';
const striptags = require('striptags');

// application
import { User } from '../models/user.model';
import { mailer, frankSignature } from '../modules/mailer';
import { getProtocolByHost } from '../modules/utility';

const AUTH_TOKEN_SECRET: string = conf.get('AUTH_TOKEN_SECRET');

export function generateJWT({ email, password } = { email: '', password: '' }) {
    return User.scope('defaultScope', 'private').findOne({
        where: { email },
     }).then(user => {
        if (!user) {
            throw new Error('Invalid Credentials');
        } else {
            let valid = user.validPassword(password);
            if (!valid) {
                throw new Error('Invalid Credentials');
            } else {
                // Create a token
                let tokenPayload = {
                    sub: user.getDataValue('id'),
                    role: user.getDataValue('role'),
                    iat: moment().unix(),
                    exp: moment().add(14, 'days').unix()
                };
                
                return JWT.sign(tokenPayload, AUTH_TOKEN_SECRET);
            }
        }
     });
}

export function resetPassword(token: string, password: string) {
    if (!token) throw new Error('Token Can\'t Be Null!');
    return User.scope('defaultScope', 'private').findOne({
        where: { resetPasswordToken: token, resetPasswordTokenExpires: { $gt: new Date() } },
    }).then(user => {
        if (!user) {
            throw new Error('Invalid Token');
        } else {
            return user.setPassword(password).then(u => {
                u.setDataValue('resetPasswordToken', '');
                u.setDataValue('resetPasswordTokenExpires', null);
                return u.save();
            });
        }
    });
}

export function requestResetPasswordToken(email: string, host: string) {
    let promise = new Promise((resolve, reject) => {
        User.scope('defaultScope', 'private').findOne({
            where: { email }
        }).then(user => {
            if (!user) {
                resolve();
            } else {
                user.generatePasswordResetToken().then(token => {
                    if (!token || typeof token != 'string') {
                        throw new Error('Error Generating Token');
                    }
                    let protocol = getProtocolByHost(host);
                    let resetURL = `${protocol}://${host}/admin/reset-password/${token}`;
                    let to = user.getDataValue('email');
                    let from = 'CSG Notification <noreply@csgpro.com>';
                    let subject = 'Password Reset Request';
                    let html = `Hi ${user.getDataValue('firstName')},<br>
                        <br>
                        I received a request to reset your password. If this was you, you may reset your password by clicking the link below.<br>
                        <br>
                        For your safety, the link will expire in 48 hours.<br>
                        <br>
                        ${resetURL}<br>
                        <br>
                        If this wasn't you, please disregard this email.<br>
                        <br>
                        ${frankSignature}
                    `;
                    let text = striptags(html);

                    mailer.sendMail({ to, from, subject, html, text }, (err, info) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(info);
                        }
                    });
                }).catch(e => reject(e));
            }
        });
    });
    return promise;
}

export function getUsers() {
    return User.findAndCountAll().then(data => {
        let users = [...data.rows];
        Object.defineProperty(users, 'count', {
            value: data.count
        });
        return users;
    })
}

export function getUser(userId: number) {
    return User.findOne({ where: { id: userId } });
}