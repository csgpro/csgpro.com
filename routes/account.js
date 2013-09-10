'use strict';

var moment = require('moment');
var db = require('../modules/db');

exports.index = function(req, res) {

  db.getUsers(function(err, users){
    if (err) {
      res.send(err);
    } else {
      res.render('admin/account', {
        user: req.user,
        moment: moment,
        users: users
      });
    }
  });

};

