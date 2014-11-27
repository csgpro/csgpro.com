/*jslint
  node: true*/

'use strict';

var self        = this,
	db			= require('../../modules/db2'),
	sanitize	= require('validator').sanitize,
	_			= require('lodash');

self.getTopics = function (req, res) {
	db.getCollection('topics', function(err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Retrieving Topics',
				error: err
			};
			res.send(JSON.stringify(msg));
		} else {
			// Sort the data by Name.
			data = _.sortBy(data, 'Name');
			res.send(data);
		}
	});
};

self.getTopicByID = function (req, res) {
	var id = req.params.id;
	db.getItem('topics', id, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Retrieving Topic',
				error: err
			};
			res.send(JSON.stringify(msg));
		} else {
			res.send(data);
		}
	});
};

self.createTopic = function (req, res) {
	db.createItem('topics', req.body, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Creating Topic',
				error: err
			};
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Created Topic',
				id: data.id
			};
		}
		res.send(JSON.stringify(msg));
	});
};

self.updateTopic = function (req, res) {
	db.updateItem('topics', req.params.id, req.body, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Updating Topic',
				error: err
			};
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Updated Topic',
				id: data.id
			};
		}
		res.send(JSON.stringify(msg));
	});
};

self.deleteTopic = function (req, res) {
	db.deleteItem('topics', req.params.id, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Deleting Topic',
				error: err
			};
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Deleted Topic'
			};
		}
		res.send(JSON.stringify(msg));
	});
};
