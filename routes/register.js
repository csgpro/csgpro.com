
var db = require('../modules/db');

exports.powerplay = function(req, res){
  res.render('register-powerplay', {
    title: 'Power Play Event Registration',
    pageClass: 'register',
    icsfile: 'powerplay_webcast_062614.ics',
    csvfile: 'powerplay-registrants.csv'
  });
};

exports.sharepoint = function(req, res){
  res.render('register-sharepoint', {
    title: 'SharePoint Event Registration',
    pageClass: 'register',
    icsfile: 'sharepoint-event.ics',
    csvfile: 'sharepoint-registrants.csv'
  });
};
