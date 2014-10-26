/*jslint
node: true */

'use strict';

var self = this;

var request = require('request'),
	c = require('nconf'),
	_ = require('lodash');

// Load config files
c.env().file({ file: 'config.json' });

var appKey = c.get('AZURE_MOBILE_SERVICES_APPLICATION_KEY');

var options = {
	headers: {
		'X-ZUMO-APPLICATION': appKey
	},
	json: true
};

var url = 'https://csgblogs.azure-mobile.net';

/************
 * GET
 ***********/
self.getCollection = function (entity, callback) {

	options.uri = url + '/tables/' + entity;
	options.method = null;

	request.get(options, function(err, obj, response){
		if(err) {
			callback(err);
		} else if (response !== null) {
			callback(null, response);
		} else {
			callback(new Error('Error retrieving data.'));
		}
	});
};

self.getFilteredCollection = function (collectionStr, callback) {

	options.uri = url + '/api/' + collectionStr;
	options.method = null;

	request.get(options, function(err, obj, response){
		if(err) {
			callback(err);
		} else if (response !== null) {
			callback(null, response);
		} else {
			callback(new Error('Error retrieving data.'));
		}
	});
};

self.getItem = function (entity, searchStr, callback) {
	var newEntity = entity;

	if(parseInt(searchStr)) {
		newEntity = newEntity + '/' + searchStr;
	} else {
		newEntity = newEntity + '/?' + searchStr;
	}
	self.getCollection(newEntity, callback);
};

/************
 * CREATE
 ***********/
self.createItem = function(entity, data, callback) {

	if(typeof data !== 'object' && data !== null) {
		callback(new Error('Error creating item.'));
	} else {
		options.uri = url +'/tables/' + entity;
		options.json = data;
		options.method = null;

		request.post(options, function(err, obj, response) {
			if(err) {
				callback(err);
			} else if (response !== null && response.hasOwnProperty('id')) {
				callback(null, response);
			} else {
				callback(new Error('Error creating item.'));
			}
		});
	}
};

/************
 * UPDATE
 ***********/
self.updateItem = function (entity, id, data, callback) {

	if(!parseInt(id) && typeof data !== 'object' && data !== null) {
		callback(new Error('Error updating item.'));
	} else {

		options.uri = url +'/tables/' + entity + '/' + id;
		options.json = data;
		options.method = null;

		request.patch(options, function(err, obj, response) {
			if(err) {
				callback(err);
			} else if (response !== null && response.hasOwnProperty('id')) {
				callback(null, response);
			} else {
				callback(new Error('Error updating item.'));
			}
		});
	}
};

/************
 * DELETE
 ***********/
self.deleteItem = function (entity, id, callback) {
	if(!parseInt(id)) {
		callback(new Error('Error deleting item.'));
	} else {

		options.uri = url +'/tables/' + entity + '/' + id;
		options.method = null;

		request.del(options, function(err, obj, response) {
			if(err) {
				callback(err);
			} else if (response !== null) {
				callback(null, response);
			} else {
				callback(new Error('Error deleting item.'));
			}
		});
	}
}

/************
 * EXPORT
 ***********/
module.exports.getCollection = self.getCollection;
module.exports.getFilteredCollection = self.getFilteredCollection;
module.exports.getItem = self.getItem;
module.exports.createItem = self.createItem;
module.exports.updateItem = self.updateItem;
module.exports.deleteItem = self.deleteItem;

/************
 * HELPERS
 ***********/
