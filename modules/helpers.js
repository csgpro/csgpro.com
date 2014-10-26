/*jslint
  node: true*/

'use strict';

var self = this,
	_ = require('lodash');

self.getPublishedPosts = function (data) {
    return data.filter(function(i) {
        return parseInt(i.PublishDate, 10) > 0; // only published posts
    });
};

self.getLatestXByProp = function (data, sortProp, search, x) {
    return _.first(_.where(_.sortBy(data, sortProp).reverse(), search), x);
};

self.sortArray = function (data, sortProp, sort) {
	var result = _.sortBy(data, sortProp);
	if(sort && sort === 'DESC') {
		result = result.reverse();
	}
	return result;
};

self.getCollectionByKeyVal = function (data, keyVal) {
	var sorted = self.sortArray(data, 'PublishDate', 'DESC');
	return _.where(sorted, keyVal);
};

module.exports.getPublishedPosts = self.getPublishedPosts;
module.exports.getLatestXByProp = self.getLatestXByProp;
module.exports.sortArray = self.sortArray;
module.exports.getCollectionByKeyVal = self.getCollectionByKeyVal;
