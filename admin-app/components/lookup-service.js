(function() {
	'use strict';

	angular.module('app')
		.service('lookup', ['common', 'httpService', function(common, httpService) {
			var self = this;

			self.getAvailableTopics = function () {
				return httpService.getCollection('topics');
			};

			self.getAvailableCategories = function () {
				return ['Blog', 'News', 'Career'];
			};


			return self;
		}]);
})();
