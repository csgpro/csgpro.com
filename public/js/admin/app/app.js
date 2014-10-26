(function() {
	'use strict';

	angular.module('app', [ 'site-config', 'satellizer', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection' ])
		.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
			$routeProvider
				.when('/', {
					controller: 'HomeCtrl',
					controllerAs: 'homeViewModel',
					templateUrl: 'home/home.html',
					title: 'Admin Dashboard',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if (!$auth.isAuthenticated()) {
								return $location.path('/login');
							}
						}]
					}
				})
				.when('/posts', {
					controller: 'PostsCtrl',
					controllerAs: 'postsViewModel',
					templateUrl: 'posts/posts.html',
					title: 'Posts',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if (!$auth.isAuthenticated()) {
								return $location.path('/login');
							}
						}],
						data: ['httpService', function(httpService) {
							return httpService.getCollection('posts');
						}]
					}
				})
				.when('/login', {
					controller: 'LoginCtrl',
					controllerAs: 'loginViewModel',
					templateUrl: 'login/login.html',
					title: 'Login',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if($auth.isAuthenticated()) {
								return $location.path('/');
							}
						}]
					}
				})
				.when('/logout', {
					controller: 'LoginCtrl',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if ($auth.isAuthenticated()) {
								$auth.logout().then(function() {
									return $location.path('/');
								});
							}
						}]
					}
				})
				.when('/profile', {
					controller: 'ProfileCtrl',
					controllerAs: 'profileViewModel',
					templateUrl: 'profile/profile.html',
					title: 'Profile',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if (!$auth.isAuthenticated()) {
								return $location.path('/login');
							}
						}],
						data: ['httpService', function(httpService) {
							return httpService.getItem('users', 'me');
						}]
					}
				})
				.otherwise({
					redirectTo: '/'
				});

			$authProvider.twitter({
		      url: '/auth/twitter'
		    });

		}]);
})();
