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
				res.render('404');
			} else {
				res.send(data);
			}
		});
	} else {
		db.getCollection('posts', function(err, data) {
			if (err) {
				res.render('404');
			} else {
				if (categoryFilter) {
					// Do something with the data;
					data = _.where(data, { "Category": categoryFilter });
				}
				res.send(data);
			}
		});
	}
};

self.getPostByID = function (req, res) {
	var id = req.params.id;
	db.getItem('posts', id, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			res.send(data);
		}
	});
};

self.createPost = function (req, res) {
	db.createItem('posts', req.body, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			res.send(data);
		}
	});
};

self.updatePost = function (req, res) {
	db.updateItem('posts', req.params.id, req.body, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			res.send(data);
		}
	});
};

self.deletePost = function (req, res) {
	db.deleteItem('posts', req.params.id, function (err, data) {
		if (err) {
			res.render('404');
		} else {
			res.send(data);
		}
	});
};
