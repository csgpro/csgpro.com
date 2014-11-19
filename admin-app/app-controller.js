(function() {
	'use strict';

	angular.module('app')
		.controller('AppCtrl', ['CONFIG', '$rootScope', '$route', '$auth', '$location', 'common', function(CONFIG, $rootScope, $route, $auth, $location, common) {
			var appViewModel = this;

			$rootScope.$on('$routeChangeSuccess', function () {
				appViewModel.title = $route.current.title + ' | ' + $rootScope.siteTitle;
				$rootScope.pageTitle = $route.current.title;
				common.toolbarReset();
			});

	        $rootScope.$on('$routeChangeError', function(event, cur, prev, rejection) {
	            var redirect = (!angular.isUndefined(prev)) ? prev.originalPath : '/';
	            notifications.showWarning(rejection);
	            $location.path(redirect);
	        });

			$rootScope.$on('$routeChangeStart', function(event) {
				if (!$auth.isAuthenticated() && $location.path() !== '/login') {
					$location.path('/login');
					event.preventDefault();
				}
			});

	        $rootScope.siteTitle = CONFIG.SITE_NAME;

	        appViewModel.title = 'Loading ... | ' + $rootScope.siteTitle;
		}]);
})();
