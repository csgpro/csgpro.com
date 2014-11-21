/*jslint
  node: true*/

'use strict';

var self        = this,
	db			= require('../../modules/db2'),
	sanitize	= require('validator').sanitize,
	_			= require('lodash');

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
					post.PublishDate = post.PublishDate ? post.UpdateDate : null;
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
	db.createItem('posts', req.body, function (err, data) {
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
		}
		res.send(JSON.stringify(msg));
	});
};

self.updatePost = function (req, res) {
	db.updateItem('posts', req.params.id, req.body, function (err, data) {
		if (err) {
			var msg = {
				status: 'fail',
				message: 'Error Updating Post',
				error: err
			};
		} else {
			var msg = {
				status: 'success',
				message: 'Successfully Updated Post',
				id: data.id
			};
		}
		res.send(JSON.stringify(msg));
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
