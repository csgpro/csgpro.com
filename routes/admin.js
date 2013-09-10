'use strict';

exports.index = function(req, res) {
  res.render('admin/index', { user: req.user });
};

exports.login = function(req, res) {
  res.render('admin/login', { user: req.user });
};