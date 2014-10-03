/*jslint
  node: true*/

'use strict';

var csv = require('ya-csv');
var email = require ('../modules/email');
var moment = require('moment');
var spam = require('../modules/spam');

var isSpam = false;

exports.powerplay = function(req, res){
  res.render('register-powerplay', {
    title: 'Power Play Event Registration',
    pageClass: 'register',
    icsfile: 'powerplay_webcast_062614.ics',
    csvfile: 'powerplay-registrants.csv',
    details: 'Live Webcast Presented by CSG Pro on Thursday June 26th at 9am (PDT)',
    headerImg: 'email-powerplay-header.png',
    buttonImg: 'email-powerplay-save-cal.png',
    cryptoTime: spam.create()
  });
};

exports.sharepoint = function(req, res){
  res.render('register-sharepoint', {
    title: 'SharePoint Event Registration',
    pageClass: 'register',
    icsfile: 'sharepoint-event.ics',
    csvfile: 'sharepoint-registrants.csv',
    details: 'Live Webcast Presented by CSG Pro on May 30th at 11am (PDT)',
    cryptoTime: spam.create()
  });
};

exports.powerbi = function(req, res){
    var details = 'Date: October 15, 2014<br />' +
                  'Time: 8:15am to 9:45am<br />' +
                  'Place: Microsoft Boise Office - 401 W. Front Street Suite 600 Boise, ID 83702';
  res.render('register-power-bi', {
    title: 'Fast-Tracking Data Mastery with Power BI Event Registration',
    pageClass: 'register',
    icsfile: 'power-bi-event.ics',
    csvfile: 'power-bi-registrants.csv',
    details: details,
    cryptoTime: spam.create()
  });
};

exports.pdxpowerbi = function(req, res){
    var details = 'Date: October 29, 2014<br />' +
                  'Time: 8:15am to 9:45am<br />' +
                  'Place: Microsoft Portland Office - 1414 NW Northrup St Suite 900 Portland, OR 97209';
  res.render('register-power-bi', {
    title: 'Fast-Tracking Data Mastery with Power BI Event Registration',
    pageClass: 'register',
    icsfile: 'pdx-power-bi-event.ics',
    csvfile: 'pdx-power-bi-registrants.csv',
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
