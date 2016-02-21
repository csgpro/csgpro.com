'use strict';

import * as nodemailer from 'nodemailer';
import * as conf from 'nconf';

let sendgridTransport = require('nodemailer-sendgrid-transport');

const options = {
    auth: {
        api_key: conf.get('SENDGRID_APIKEY')
    }
}

export let mailer = nodemailer.createTransport(sendgridTransport(options));