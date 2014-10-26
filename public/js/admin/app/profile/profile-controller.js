(function() {
	'use strict';

	angular.module('app')
		.controller('ProfileCtrl', ['data', function(data) {
			// Do Awesome Stuff!
			var profileViewModel = this;

			profileViewModel.user = data;

		}]);
})();
