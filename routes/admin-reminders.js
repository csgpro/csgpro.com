/*jslint
  node: true*/

'use strict';

var fs = require('fs'),
    csv = require('ya-csv'),
    send = require('./register.js');

var updateFileObject = function(file) {
  switch(file.name) {
    case 'powerplay-registrants.csv':
        file.title = 'Power Play Event Registration';
        file.details = 'Live Webcast Presented by CSG Pro on Thursday June 26th at 9am (PDT)';
        file.headerimg = 'email-powerplay-header.png';
        file.buttonimg = 'email-powerplay-save-cal.png';
        file.icsfile = 'powerplay_webcast_062614.ics';
        break;
    case 'sharepoint-registrants.csv':
        file.title = 'SharePoint Event Registration';
        file.details = 'Live Webcast Presented by CSG Pro on May 30th at 11am (PDT)';
        file.headerimg = '';
        file.buttonimg = '';
        file.icsfile = 'sharepoint-event.ics';
        break;
    case 'power-bi-registrants.csv':
        file.title = 'Fast-Tracking Data Mastery with Power BI Event Registration';
        file.details = 'Date: November 13, 2014<br />' +
                      'Time: 8:15am to 9:45am<br />' +
                      'Place: Microsoft Boise Office - 401 W. Front Street Suite 600 Boise, ID 83702';
        file.headerimg = '';
        file.buttonimg = '';
        file.icsfile = 'power-bi-event.ics';
        break;
    case 'pdx-power-bi-registrants.csv':
        file.title = 'Fast-Tracking Data Mastery with Power BI Event Registration';
        file.details = 'Date: October 29, 2014<br />' +
                      'Time: 8:15am to 9:45am<br />' +
                      'Place: Microsoft Portland Office - 1414 NW Northrup St Suite 900 Portland, OR 97209';
        file.headerimg = '';
        file.buttonimg = '';
        file.icsfile = 'pdx-power-bi-event.ics';
        break;
  }
}

exports.index = function(req, res) {

  fs.readdir('./public/exports', function (err, files) { // '/' denotes the root folder
    if (err) {
      res.send(err);
    } else {
      var csvFiles = [];
      for(var i in files) {
        var filename = files[i];
        var parts = filename.split('.');
        var extension = parts[parts.length-1];
        if ('csv' === extension) {
          var file = {};
          file.name = filename;
          updateFileObject(file);
          csvFiles.push(file);
        }
      }
      res.render('admin/reminders', {
        files: csvFiles
      });
    }
  });
};

exports.send = function(req, res) {

  var registrants = [];

  var file = 'public/exports/' + req.body.file;
  var subject = req.body.subject;
  var message = req.body.message;
  var totalSent = 0; // Need to get count from csv to compare

  var reader = csv.createCsvFileReader(file);
  reader.setColumnNames([ 'company', 'firstname', 'lastname', 'email' ]);
  reader.addListener('data', function(data) {
    var dataRecord = [
      {
        label: 'Company Name',
        value: data.company
      },
      {
        label: 'First Name',
        value: data.firstname
      },
      {
        label: 'Last Name',
        value: data.lastname
      },
      {
        label: 'Email Address',
        value: data.email
      }
    ];
    var reminder = {
      email: data.email,
      subject: subject,
      message: message,
      record: dataRecord
    };

    send.sendConfirmation(reminder);
  });
  if(true) {
    res.send('success');
  } else {
    res.send('fail!');
  }
};
