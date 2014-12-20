(function() {
	'use strict';

	angular.module('app')
		.controller('AppCtrl', ['CONFIG', '$rootScope', '$route', '$auth', '$location', 'common', 'UserService', 'notifications', function(CONFIG, $rootScope, $route, $auth, $location, common, UserService, notifications) {
			var appViewModel = this;

			$rootScope.$on('$routeChangeSuccess', function () {
				appViewModel.title = $route.current.title + ' | ' + $rootScope.siteTitle;
				$rootScope.pageTitle = $route.current.title;
				common.toolbarReset();
			});

	        $rootScope.$on('$routeChangeError', function(event, cur, prev, rejection) {
	            notifications.showWarning(rejection);
	        });

			$rootScope.$on('$routeChangeStart', function(event) {
				if (!$auth.isAuthenticated() && $location.path() !== '/login') {
					$location.path('/login');
					event.preventDefault();
				} else {
					var user = $auth.getPayload() && $auth.getPayload().user ? $auth.getPayload().user : null;
					if (user) {
						UserService.setUser(user);
					}
				}
			});

	        $rootScope.siteTitle = CONFIG.SITE_NAME;

	        appViewModel.title = 'Loading ... | ' + $rootScope.siteTitle;
		}]);
})();
