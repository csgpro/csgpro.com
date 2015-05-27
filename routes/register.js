/*jslint
  node: true*/

'use strict';

var csv = require('ya-csv');
var email = require ('../modules/email');
var moment = require('moment');
var spam = require('../modules/spam');

var isSpam = false;

exports.powerbi = function(req, res){
    var details = 'Date: June 16, 2015<br />' +
                  'Time: 4pm to 6pm<br />' +
                  'Place: 734 NW 14th Avenue, Portland, Oregon 97209';
  res.render('register-power-bi', {
    title: 'Understanding Microsoft’s Self-Service Landscape and the Power BI Puzzle',
    pageClass: 'register',
    icsfile: 'power-bi-event.ics',
    csvfile: 'power-bi-registrants.csv',
    details: details,
    cryptoTime: spam.create()
  });
};

exports.csv = function(req, res) {
  var isSpam;
  var rec = req.body.record;
  var csvData = [];
  for(var i in rec) {
    csvData.push(rec[i].value);
  }
  var file = 'public/exports/' + req.body.file;

  isSpam = spam.isSpam(req.body.cryptoTime) || req.body.hpizzle; // check the 'honey pot'

  if (isSpam) {
    res.send('fail!')
  } else {

    var writer = csv.createCsvFileWriter(file, {'flags': 'a'});

    writer.writeRecord(csvData);
    if(sendConfirmation(req.body)) {
      res.send('success');
    } else {
      res.send('fail!');
    }
  }
};

var sendConfirmation = exports.sendConfirmation = function(data) {
  var registrationDetails = '';

  for(var i in data.record) {
    registrationDetails = registrationDetails + data.record[i].label + ': ' + data.record[i].value + '<br>';
  }

  var message = data.message + registrationDetails + '<br><br>';

  email.sendEmail(
    data.email,
    data.subject,
    message,
    true,
    function(err, result) {
      return;
    },
    'CSG Pro <noreply@csgpro.com>'
  );

  return true;
}
