(function() {
	'use strict';

	angular.module('app', [ 'ngRoute', 'ngAnimate' ])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider
				.when('/', {
					controller: 'HomeCtrl',
					controllerAs: 'homeViewModel',
					template: 'home/home.html'
				})
				.otherwise({
					redirectTo: '/'
				})
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
