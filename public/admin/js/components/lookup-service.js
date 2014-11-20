(function() {
	'use strict';

	angular.module('app')
		.service('lookup', ['common', 'httpService', function(common, httpService) {
			var self = this;

			self.getAvailableTopics = function () {
				return httpService.getCollection('topics');
			};


			return self;
		}]);
})();
