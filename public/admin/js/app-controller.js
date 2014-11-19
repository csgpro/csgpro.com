(function() {
	'use strict';

	angular.module('app')
		.controller('AppCtrl', ['CONFIG', '$rootScope', '$route', 'common', function(CONFIG, $rootScope, $route, common) {
			var appViewModel = this;

			$rootScope.$on('$routeChangeSuccess', function () {
				appViewModel.title = $route.current.title + ' | ' + $rootScope.siteTitle;
				common.toolbarReset();
			});

	        $rootScope.$on('$routeChangeError', function(event, cur, prev, rejection) {
	            var redirect = (!angular.isUndefined(prev)) ? prev.originalPath : '/';
	            notifications.showWarning(rejection);
	            $location.path(redirect);
	        });

	        $rootScope.siteTitle = CONFIG.SITE_NAME;

	        appViewModel.title = 'Loading ... | ' + $rootScope.siteTitle;
		}]);
})();
