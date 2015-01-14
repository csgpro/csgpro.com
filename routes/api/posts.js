/*jslint
  node: true*/

'use strict';

var self        = this,
	db			= require('../../modules/db2'),
	email       = require('../../modules/email'),
	sanitize	= require('validator').sanitize,
	_			= require('lodash'),
	c 			= require('nconf');

c.env().file({ file: 'config.json' });

var localEnv = c.get('LOCAL');

self.getPosts = function (req, res) {
	var categoryFilter = null,
		topicFilter = null;

	if (req.params) {
		if (req.params.category) {
			categoryFilter = sanitize(req.params.category).xss().trim();
		}
		if (req.params.topic) {
			topicFilter = 'topic=' + sanitize(req.params.topic).xss().trim();
		}
	}

	if(topicFilter) {
		db.getFilteredCollection('allposts/?' + topicFilter, function(err, data) {
			if (err) {
				var msg = {
					status: 'fail',
					message: 'Error Retrieving Posts',
					error: err
				};
				res.send(JSON.stringify(msg));
			} else {
				res.send(data);
			}
		});
	} else {
		db.getFilteredCollection('allposts', function(err, data) {
			if (err) {
				var msg = {
					status: 'fail',
					message: 'Error Retrieving Posts',
					error: err
				};
				res.send(JSON.stringify(msg));
			} else {
				if (categoryFilter) {
					// Do something with the data;
					data = _.where(data, { "Category": categoryFilter });
				}
				// Replace '0' (zero) dates with null.
				data = _.forEach(data, function(post) {
					post.CreateDate = post.CreateDate ? post.CreateDate : null;
					post.UpdateDate = post.UpdateDate ? post.UpdateDate : null;
					post.PublishDate = post.PublishDate ? post.PublishDate : null;
				});
				// Sort the data. Newest to Oldest. (Descending)
				data = _.sortBy(data, 'CreateDate').reverse();
				res.send(data);
			}
		});
	}
};

self.getPostByID = function (req, res) {
	var id = req.params.id;
	db.getItem('posts', id, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Retrieving Post',
				error: err
			};
			res.send(JSON.stringify(msg));
		} else {
			res.send(data);
		}
	});
};

self.createPost = function (req, res) {
	var notify = req.body && req.body.notify ? req.body.notify : false;
	db.createItem('posts', req.body.post, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Creating Post',
				error: err
			};
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Created Post',
				id: data.id
			};
			if (notify) {
				sendNotification(notify, data.id);
			}
		}
		res.send(JSON.stringify(msg));
	});
};

self.updatePost = function (req, res) {
	var notify = req.body && req.body.notify ? req.body.notify : null;
	db.updateItem('posts', req.params.id, req.body.post, function (err, data) {
		if (err) {
			var statusCode = 400;
			var msg = {
				status: 'fail',
				message: 'Error Updating Post',
				error: err
			};
		} else {
			var statusCode = 200;
			var msg = {
				status: 'success',
				message: 'Successfully Updated Post',
				id: data.id
			};
			if (notify) {
				sendNotification(notify, data.id);
			}
		}
		res.status(statusCode).send(JSON.stringify(msg));
	});
};

self.deletePost = function (req, res) {
	db.deleteItem('posts', req.params.id, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Deleting Post',
				error: err
			};
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Deleted Post'
			}
		}
		res.send(JSON.stringify(msg));
	});
};

function sendNotification (msg, postId) {
	if (~msg.indexOf('add/new')) {
		var regExp = new RegExp('add\/new', 'g');
		msg = msg.replace(regExp, 'edit/' + postId);
	}
	db.getCollection('users', function(err, data) {
		var emails;
		var users = data.filter(function(user){
			return user.IsAdmin; // send email to all admins
		});
		emails = _.pluck(users, 'Username');
		emails = emails.map(function(i) { return i + '@csgpro.com'; });
		emails = emails.join(',');

		if (localEnv) {
			emails = 'kenh@csgpro.com';
		}

		email.sendEmail(
			emails, // to
			'New blog post submitted', // subject
			msg, // message body
			true,
			function(err, success){
				if (err) {
					console.log(err);
				} else {
					console.log('Emails successfully sent to ' + emails);
				}
			}
		);
	});
}
