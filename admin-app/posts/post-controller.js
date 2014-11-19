(function() {
	'use strict';

	angular.module('app')
		.controller('PostCtrl', ['data', 'common', function(data, common) {
			var postViewModel = this;

			postViewModel.post = data;
			
		}]);
})();
