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
			var msg = {
				status: 'fail',
				message: 'Error Retrieving Users',
				error: err
			};
			res.send(JSON.stringify(msg));
		} else {
			// Sort the data by Username.
			data = _.sortBy(data, 'Username');
			res.send(data);
		}
	});
};

self.getUserByID = function (req, res) {
	var id = req.params.id;
	if (!parseInt(id)) {
		if(id === 'me') {
			id = req.user;
		} else {
			res.render('404');
		}
	}
	db.getItem('users', id, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Retrieving User',
				error: err
			};
			res.send(JSON.stringify(msg));
		} else {
			res.send(data);
		}
	});
};

self.getCurrentUser = function (req, res) {
	db.getItem('users', req.user, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Retrieving User',
				error: err
			};
			res.send(JSON.stringify(msg));
		} else {
			res.send(data);
		}
	});
};

self.getUserByOther = function (req, res) {
	var search = req.params.search;
	db.getCollection('users', function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Retrieving User',
				error: err
			};
			res.send(JSON.stringify(msg));
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
	var user = req.body.user;
	db.createItem('users', user, function (err, data) {
		if (err) {
			var statusCode = 400;
			var msg = {
				status: 'fail',
				message: err.error,
				error: err,
				response: data
			};
		} else {
			var statusCode = 200;
			var msg = {
				status: 'success',
				message: 'Successfully Created User',
				id: data.id
			};
		}
		res.status(statusCode).send(JSON.stringify(msg));
	});
};

self.updateUser = function (req, res) {
	var user = req.body.user;
	db.updateItem('users', user.id, user, function (err, data) {
		if (err) {
			var statusCode = 400;
			var msg = {
				status: 'fail',
				message: err.error,
				error: err
			};
		} else {
			var statusCode = 200;
			var msg = {
				status: 'success',
				message: 'Successfully Updated User',
				id: data.id
			};
		}
		res.status(statusCode).send(JSON.stringify(msg));
	});
};

self.deleteUser = function (req, res) {
	db.deleteItem('users', req.params.id, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Deleting User',
				error: err
			};
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Deleted User'
			}
		}
		res.send(JSON.stringify(msg));
	});
};
