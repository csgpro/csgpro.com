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

exports.get = function(req, res) {
  // TODO: get a single user, not really necessary right now
};

exports.entry = function(req, res) {
  var userId = req.params.id;

  res.render('admin/account-create');
};

exports.create = function(req, res) {
  var user = req.body;
  var message = user.FullName + ' successfully updated.;'
  var type = 'success';

  db.createUser(user, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/admin/account?message='
                    + escape(message)
                    + '&type='
                    + type);
    }
  });
  
};

exports.patch = function(req, res) {
  var user = req.body;
  var message = user.FullName + ' successfully added.';
  var type = 'success';

  db.updateUser(user, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/admin/account?message=' + escape(message) + '&type=' + type);
    }

  })
};

