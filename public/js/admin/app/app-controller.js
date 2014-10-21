(function() {
	'use strict';

	angular.module('app')
		.controller('AppCtrl', ['$rootScope', '$route', function($rootScope, $route) {
			var appViewModel = this;

			appViewModel.pageTitle = 'Loading...';

			$rootScope.$on('$routeChangeSuccess', function () {
				appViewModel.pageTitle = $route.current.title;
			});
		}]);
})();
