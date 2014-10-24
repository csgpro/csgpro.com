(function() {
	'use strict';

	angular.module('app', [ 'site-config', 'satellizer', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection' ])
		.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
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
					title: 'Posts',
					resolve: {
						data: ['httpService', function(httpService) {
							return httpService.getCollection('posts');
						}]
					}
				})
				.when('/login', {
					controller: 'LoginCtrl',
					controllerAs: 'loginViewModel',
					templateUrl: 'login/login.html',
					title: 'Login'
				})
				.otherwise({
					redirectTo: '/'
				});

			$authProvider.twitter({
		      url: '/auth/twitter/callback'
		    });

		}]);
})();
