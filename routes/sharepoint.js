
var db = require('../modules/db');
var moment = require('moment');
var c = require('nconf');
var spam = require('../modules/spam');

exports.content = function(req, res){
    res.render('sharepoint', {
      title: 'CSG Pro - SharePoint Event',
      pageClass: 'sharepoint'
    });
};
