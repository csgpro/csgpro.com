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
	}
};

var url = 'https://csgblogs.azure-mobile.net';

/************
 * GET
 ***********/
self.getCollection = function (entity, callback) {

	options.uri = url + '/tables/' + entity;

	request.get(options, function(err, obj, response){
		if(err) {
			callback(err);
		} else if (response !== null) {
			var r;
			if (isJSON(response)) {
				r = JSON.parse(response);
			} else {
				r = response;
			}
			callback(null, r);
		} else {
			callback(new Error('Error retrieving data.'));
		}
	});
};

self.getFilteredCollection = function (collectionStr, callback) {

	options.uri = url + '/api/' + collectionStr;

	request.get(options, function(err, obj, response){
		if(err) {
			callback(err);
		} else if (response !== null) {
			var r;
			if (isJSON(response)) {
				r = JSON.parse(response);
			} else {
				r = response;
			}
			callback(null, r);
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

	options.uri = url +'/tables/' + entity;
	options.json = data;

	request.post(options, function(err, obj, response) {
		if(err) {
			callback(err);
		} else if (response !== null && response.hasOwnProperty('id')) {
			callback(null, response);
		} else {
			callback(new Error('Error creating item.'));
		}
	});
};

/************
 * UPDATE
 ***********/
self.updateItem = function (entity, id, data, callback) {

	options.uri = url +'/tables/' + entity + '/' + id;
	options.json = data;

	request.patch(options, function(err, obj, response) {
		if(err) {
			callback(err);
		} else if (response !== null && response.hasOwnProperty('id')) {
			callback(null, response);
		} else {
			callback(new Error('Error updating item.'));
		}
	});

};

/************
 * DELETE
 ***********/
self.deleteItem = function (entity, id, callback) {

	options.uri = url +'/tables/' + entity + '/' + id;

	request.del(options, function(err, obj, response) {
		if(err) {
			callback(err);
		} else if (response !== null) {
			callback(null, response);
		} else {
			callback(new Error('Error deleting data.'));
		}
	});
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

function isJSON(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
