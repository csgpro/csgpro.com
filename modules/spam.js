/*jslint node: true*/

'use strict';

var crypto = require('crypto');
var c = require('nconf');
var moment = require('moment');

c.env().file('config.json');

var KEY = c.get('SESSION_SECRET');
var ALGORITHM = 'aes192';
var TEXT_ENCODING = 'ascii';
var DATA_ENCODING = 'hex';
var FLOOR_SECONDS = 20; // this is the minimum spam threshold
var CEILING_SECONDS = 60 * 20; // 20 min max spam threshold

function create() {
  var now = new Date().getTime();
  var cipher = crypto.createCipher(ALGORITHM, KEY);

  cipher.update(now.toString(), TEXT_ENCODING);

  return cipher.final(DATA_ENCODING);
}

function decode(data) {
  var decipher = crypto.createDecipher(ALGORITHM, KEY);

  decipher.update(data, DATA_ENCODING);

  return decipher.final(TEXT_ENCODING);
}

/**
 * Takes an encrypted string and returns true or false if it's spam
 * @param  {Strgin}  data Encrypted text
 * @return {Boolean} `true` if spam, `false` if not
 */
function isSpam(data) {
  var now = moment();
  var startTime = decode(data);
  
  startTime = moment(parseInt(startTime, 10));

  var secDiff = now.diff(startTime, 'seconds');

  if (secDiff >= FLOOR_SECONDS && secDiff <= CEILING_SECONDS) {
    return false; // she's clean!
  } else {
    return true; // it's spam, folks...
  }

}

// Exports
module.exports.create = create;
module.exports.decode = decode;
module.exports.isSpam = isSpam;

