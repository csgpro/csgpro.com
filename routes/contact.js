/*jslint
  node: true*/

'use strict';

var email = require ('../modules/email');
var moment = require('moment');
var spam = require('../modules/spam');

exports.index = function(req, res) {

  var isSpam; // boolean
  var hasLinks; // boolean
  var item = req.body;
  var cryptoTime = req.body.cryptoTime;
  var subject = 'New Request for ' + (item.type || 'Contact');
  var replyTo = item.emailAddress;
  var message = item.name + ' submitted the contact form from csgpro.com.<br><br>'
              + 'Here\'s what they said:<br>'
              + '<b>What\'s your name?</b><br>' + item.name + '<br><br>'
              + '<b>What\'s your phone #?</b><br>' + item.phoneNumber + '<br><br>'
              + '<b>What\'s your email address?</b><br>' + item.emailAddress + '<br><br>'
              + '<b>What\'s on your mind?</b><br>' + item.comments +'<br><br>';
  if (item.type) {
    message = item.name + ' submitted the contact form from csgpro.com.<br><br>'
            + 'Here\'s what they said:<br>'
            + '<b>Type:</b><br>' + item.type + '<br><br>'
            + '<b>What\'s your name?</b><br>' + item.name + '<br><br>'
            + '<b>What\'s your phone #?</b><br>' + item.phoneNumber + '<br><br>'
            + '<b>What\'s your email address?</b><br>' + item.emailAddress + '<br><br>'
            + '<b>What\'s on your mind?</b><br>' + item.comments +'<br><br>';
  }


  isSpam =  spamDodger(cryptoTime) || item.hpizzle; // check the 'honey pot'

  function spamDodger(cryptoTime){
    if(cryptoTime === "ce089e85edfdcc0fa44ae66d8c02a304"){
      return false;
    }
    else{
      return spam.isSpam(cryptoTime);
    }
  }

  // If the comments have 2 or more links, consider it spam

  hasLinks = item.comments.match(/<a/gi);
  if (hasLinks)
    hasLinks = hasLinks.length >= 2;

  if (isSpam || hasLinks) {
    res.send('fail');
  } else {
    console.log('Email sent: ' + JSON.stringify(item));
    console.log('Sender request headers: ' + JSON.stringify(req.headers));

    email.sendEmail(
      'info@csgpro.com',
      replyTo,
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
