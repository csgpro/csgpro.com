/*jslint
  node: true*/

'use strict';

var email = require ('../modules/email');
var moment = require('moment');
var spam = require('../modules/spam');

exports.index = function(req, res) {

  var isSpam; // boolean
  var item = req.body;
  var cryptoTime = req.body.cryptoTime;
  var subject = 'New Request for ' + (item.type || 'Contact');
  var message = 'Someone submitted the contact form from csgpro.com.<br><br>'
              + 'Here are the details of that submission:<br>'
              + '<b>What\'s your name?</b><br>' + item.name + '<br><br>'
              + '<b>How can we reach you?</b><br>' + item.contactInfo + '<br><br>'
              + '<b>So, what\'s on your mind?</b><br>' + item.comments +'<br><br>';
  if (item.type) {
    message = 'Someone submitted the contact form from csgpro.com.<br><br>'
            + 'Here are the details of that submission:<br>'
            + '<b>Type:</b><br>' + item.type + '<br><br>'
            + '<b>What\'s your name?</b><br>' + item.name + '<br><br>'
            + '<b>How can we reach you?</b><br>' + item.contactInfo + '<br><br>'
            + '<b>So, what\'s on your mind?</b><br>' + item.comments +'<br><br>';
  }

  isSpam = spam.isSpam(cryptoTime) || item.hpizzle; // check the 'honey pot'

  if (isSpam) {
    res.send('fail');
  } else {
    console.log('Email sent: ' + JSON.stringify(item));

    email.sendEmail(
      'Webmaster@csgpro.com,jond@csgpro.com', 
      subject,
      message,
      true,
      function(err, result) {
        if (err) {
          res.send('fail');
        } else {
          res.send('success');
        }
      }
    );
  }
};
