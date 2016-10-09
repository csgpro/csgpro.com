'use strict';

import * as nodemailer from 'nodemailer';

let sendgridTransport = require('nodemailer-sendgrid-transport');

const CSGBOT_URL = process.env.CSGBOT_URL;
const CSGBOT_IMG_URL = process.env.CSGBOT_IMG_URL;

const options = {
    auth: {
        api_key: process.env.SENDGRID_APIKEY
    }
};

export let mailer = nodemailer.createTransport(sendgridTransport(options));

export let frankSignature = `
Thank you,<br>
<br>
<a href="${CSGBOT_URL}">@frank</a> - The Friendly CSG Pro Bot<br>
<br>
<a href="${CSGBOT_URL}"><img src="${CSGBOT_IMG_URL}" width="48" height="48"></a>
`;