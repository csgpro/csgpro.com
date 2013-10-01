/*jslint
  node: true*/

'use strict';

var email = require ('../modules/email');
var moment = require('moment');
var recaptcha = require('../modules/recaptcha');

exports.index = function(req, res) {
  // recaptcha stuff
  var data = {
    remoteip:  req.connection.remoteAddress,
    challenge: req.body.recaptcha_challenge_field,
    response:  req.body.recaptcha_response_field
  };

  var item = req.body;
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

  recaptcha.verify(data, function(err) {
    if (err) {
      res.redirect('/?contacted=false');
    } else {
      console.log('Email would be sent here');

      // Temporary comment out
      // email.sendEmail(
      //   'info@csgpro.com', 
      //   subject,
      //   message,
      //   true,
      //   function(err, result) {

      //     if (!item.type) {
      //       if (err) {
      //         res.redirect('/?contacted=false#contact');
      //       } else {
      //         res.redirect('/?contacted=true#contact');
      //       }
      //     } else {
      //       if (err) {
      //         res.json({success: false});
      //       } else {
      //         res.json({success: true});
      //       }
      //     }
      //   }
      // );
    }
  });
};
