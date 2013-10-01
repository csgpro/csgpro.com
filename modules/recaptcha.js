/*jslint node:true*/

'use strict';

var Recaptcha = require('re-captcha');
var c = require('nconf');

// Load config files
c.env().file({ file: 'config.json'});

var RECAPTCHA_PRIVATE_KEY = c.get('RECAPTCHA_PRIVATE_KEY');
var RECAPTCHA_PUBLIC_KEY = c.get('RECAPTCHA_PUBLIC_KEY');

var recaptcha = new Recaptcha(RECAPTCHA_PUBLIC_KEY, RECAPTCHA_PRIVATE_KEY);

module.exports = recaptcha;


