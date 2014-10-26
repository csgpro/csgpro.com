(function() {
	'use strict';

	angular.module('app')
		.controller('ProfileCtrl', ['data', '$filter', function(data, $filter) {
			// Do Awesome Stuff!
			var profileViewModel = this;

			profileViewModel.user = data;

			profileViewModel.user.CreateDateDisplay = $filter('date')(profileViewModel.user.CreateDate);

		}]);
})();
