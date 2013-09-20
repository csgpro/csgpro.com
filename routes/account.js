/*jslint
  node: true */

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
        users: users,
        message: req.query.message,
        type: req.query.type
      });
    }
  });

};

exports.del = function(req, res) {
  var userId = req.params.id;
  var message;
  var type;

  db.deleteUser(userId, function(err, account) {
    if (err) {
      message = 'Error deleting user id: ' + userId + err;
      type = 'danger';

      res.redirect('/admin/account?message='
                    + escape(message)
                    + '&type='
                    + type);
    } else {
      message = 'User deleted successfully.';
      type = 'success';

      res.redirect('/admin/account?message='
                    + escape(message)
                    + '&type='
                    + type);
    }
  }); 

};

exports.entry = function(req, res) {
  res.render('admin/account-create');
};

exports.update = function(req, res) {
  var userId = req.params.id;
  var message;
  var type;

  db.getUser(userId, function(err, account) {
    if (err) {
      message = 'Error getting user id ' + userId + err;
      type = 'danger';

      res.redirect('/admin/account?message='
                    + escape(message)
                    + '&type='
                    + type);
    } else {

      res.render('admin/account-create', {
        account: account
      });
    }
  }); 

};


exports.create = function(req, res) {
  var user = req.body;
  var message = user.FullName + ' was successfully added.';
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
  var message = user.FullName + ' was successfully updated.';
  var type = 'success';

  user.id = parseInt(req.params.id, 10);

  db.updateUser(user, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/admin/account?message=' + escape(message) + '&type=' + type);
    }

  });
};

