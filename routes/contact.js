/*jslint
  node: true*/

var email = require ('../modules/email');
var moment = require('moment');

'use strict';

exports.index = function(req, res) {
  var item = req.body;
  var subject = 'New Request for Contact';
  var message = 'Someone submitted the contact form from csgpro.com.<br><br>'
              + 'Here are the details of that submission:<br>'
              + '<b>What\'s your name?</b><br>' + item.name + '<br><br>'
              + '<b>How can we reach you?</b><br>' + item.contactInfo + '<br><br>'
              + '<b>So, what\'s on your mind?</b><br>' + item.comments +'<br><br>';

  email.sendEmail(
    'info@csgpro.com', 
    subject,
    message,
    true,
    function(err, result) {
      if (err) {
        console.log(err);
        res.redirect('/?contacted=false#contact');
      } else {
        res.redirect('/?contacted=true#contact');
      }
    }
  );
};
