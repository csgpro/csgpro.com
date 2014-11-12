(function() {
	'use strict';

	angular.module('app')
		.controller('AppCtrl', ['$rootScope', '$route', 'common', function($rootScope, $route, common) {
			var appViewModel = this;

			$rootScope.$on('$routeChangeSuccess', function () {
				appViewModel.pageTitle = $rootScope.pageTitle = $route.current.title;
				common.toolbarReset();
			});
		}]);
})();
