(function() {
	'use strict';

	angular.module('app')
		.service('lookup', ['common', 'httpService', '$q', function(common, httpService, $q) {
			var self = this;

			self.getAvailableTopics = function () {
				return httpService.getCollection('topics');
			};

			self.getAvailableCategories = function () {
				return $q(function(resolve) {
				    resolve(['Blog','News','Career']);
				  });
			};

			self.getAvailableUsers = function () {
				return httpService.getCollection('users');
			};


			return self;
		}]);
})();
