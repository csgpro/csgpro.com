'use strict';

exports.index = function(req, res) {
  res.header('Access-Control-Allow-Origin', "*")
  res.render('admin/index', { user: req.user });
};

exports.login = function(req, res) {
  var message = req.query.message;

  res.render('admin/login', {
    user: req.user,
    message: message
  });
};
