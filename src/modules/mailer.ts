'use strict';

import * as nodemailer from 'nodemailer';
import * as conf from 'nconf';

let sendgridTransport = require('nodemailer-sendgrid-transport');

const CSGBOT_URL = conf.get('CSGBOT_URL');
const CSGBOT_IMG_URL = conf.get('CSGBOT_IMG_URL');

const options = {
    auth: {
        api_key: conf.get('SENDGRID_APIKEY')
    }
};

export let mailer = nodemailer.createTransport(sendgridTransport(options));

export let frankSignature = `
Thank you,<br>
<br>
<a href="${CSGBOT_URL}">@frank</a> - The Friendly CSG Bot<br>
<br>
<a href="${CSGBOT_URL}"><img src="${CSGBOT_IMG_URL}" width="48" height="48"></a>
`;