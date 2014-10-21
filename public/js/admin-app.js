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
				.when('/posts', {
					controller: 'PostsCtrl',
					controllerAs: 'postsViewModel',
					templateUrl: 'posts/posts.html',
					title: 'Posts'
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

(function() {
	'use strict';

	angular.module('app')
		.controller('PostsCtrl', [function() {
			// Do Awesome Stuff!
			var postsViewModel = this;
		}]);
})();
