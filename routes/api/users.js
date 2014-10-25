/*jslint
  node: true*/

'use strict';

var self = this,
	db			= require('../../modules/db2'),
	sanitize	= require('validator').sanitize,
	_			= require('lodash');

self.getUsers = function (req, res) {
	db.getCollection('users', function (err, data) {
		if (err) {
			res.render('404');
		} else {
			res.send(data);
		}
	});
};

self.getUserByID = function (req, res) {
	var id = req.params.id;
	db.getItem('users', id, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			res.send(data);
		}
	});
};

self.getUserByOther = function (req, res) {
	var search = req.params.search;
	db.getCollection('users', function (err, data) {
		if (err) {
			res.render('404');
		} else {
			var s = search.split('|');
			if(s.length) {
				var lookup = {};
				lookup[s[0]] = s[1];
				var	searchResultData = _.where(data, lookup);
				if (searchResultData.length) {
					res.send(searchResultData[0]);
				} else {
					res.send(new Error('Profile not found, user is not authorized.'));
				}
			} else {
				res.send(new Error('Profile not found, user is not authorized.'));
			}
		}
	});
};

self.createUser = function (req, res) {
	db.createItem('users', req.body, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Created User',
				id: data.id
			};
			res.send(JSON.stringify(msg));
		}
	});
};

self.updateUser = function (req, res) {
	db.updateItem('users', req.params.id, req.body, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Updated User',
				id: data.id
			};
			res.send(JSON.stringify(msg));
		}
	});
};

self.deleteUser = function (req, res) {
	db.deleteItem('users', req.params.id, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Deleted User'
			}
			res.send(JSON.stringify(msg));
		}
	});
};
