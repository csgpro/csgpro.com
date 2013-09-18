/*jslint node: true*/

'use strict';

var nodemailer = require('nodemailer');



var smtp = nodemailer.createTransport('SMTP', {
  host: 'smtp.comcast.net'
});

var options = {
  from: 'Jon <jond@csgpro.com>',
  to: 'Jon de la Motte <jondlm@gmail.com>',
  subject: 'Test Subject',
  text: 'Here is a plain text body'
};

smtp.sendMail(options, function(err, response){
  if (err) {
    console.log(err);
  } else {
    console.log('Message sent.' + response.message);
  }

});