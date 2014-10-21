(function() {
	'use strict';

	angular.module('app', [ 'ngRoute', 'ngAnimate' ])
		.config(function($routeProvider) {
			$routeProvider
				.when('/', {
					controller: 'HomeCtrl',
					controllerAs: 'homeViewModel',
					templateUrl: 'home/home.html',
					title: 'Admin Dashboard'
				})
				.otherwise({
					redirectTo: '/'
				})
		});




})();

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

(function() {
	'use strict';

	angular.module('app')
		.controller('HomeCtrl', [function() {
			// Do Awesome Stuff!
			var homeViewModel = this;

		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('NavbarCtrl', [function() {
			var navbarViewModel = this;
		}]);
})();
