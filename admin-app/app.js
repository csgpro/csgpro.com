(function() {
	'use strict';

	angular.module('app', [ 'site-config', 'satellizer', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngGrid', 'angularFileUpload', 'toaster', 'cgBusy', 'templates' ])
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
							return httpService.getCollection('posts', true);
						}]
					}
				})
				.when('/posts/edit/:postID', {
					controller: 'PostCtrl',
					controllerAs: 'postViewModel',
					templateUrl: 'posts/post-edit.html',
					title: 'Edit Post',
					resolve: {
						data: ['httpService', '$route', function(httpService, $route) {
							return httpService.getItem('posts', $route.current.params.postID, true);
						}]
					}
				})
				.when('/posts/add/new', {
					controller: 'PostCtrl',
					controllerAs: 'postViewModel',
					templateUrl: 'posts/post-edit.html',
					title: 'Add Post',
					resolve: {
						data: function() {
							return null;
						}
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
