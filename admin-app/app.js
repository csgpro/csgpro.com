(function() {
	'use strict';

	angular.module('app', [ 'site-config', 'satellizer', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngGrid', 'angularFileUpload', 'toaster', 'cgBusy', 'templates', 'hc.marked' ])
		.config(['$routeProvider', '$authProvider', 'markedProvider', function($routeProvider, $authProvider, markedProvider) {

			markedProvider.setOptions({
			  gfm: true,
			  tables: true,
			  breaks: false,
			  pedantic: false,
			  sanitize: false,
			  smartLists: true,
			  smartypants: false,
			  langPrefix: 'lang-'
			});
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
					controller: 'UserCtrl',
					controllerAs: 'userViewModel',
					templateUrl: 'users/user.html',
					title: 'Edit Profile',
					resolve: {
						data: ['httpService', function(httpService) {
							return httpService.getItem('users', 'me', true);
						}]
					}
				})
				.when('/accounts', {
					controller: 'UsersCtrl',
					controllerAs: 'usersViewModel',
					templateUrl: 'users/users.html',
					title: 'Accounts',
					resolve: {
						data: ['common', 'httpService', 'UserService', function(common, httpService, UserService) {
							if (UserService.IsAdmin()) {
								return httpService.getCollection('users', true);
							} else {
								common.goToUrl('/');
							}
						}]
					}
				})
				.when('/accounts/edit/:userId', {
					controller: 'UserCtrl',
					controllerAs: 'userViewModel',
					templateUrl: 'users/user.html',
					title: 'Edit Account',
					resolve: {
						data: ['httpService', '$route', function(httpService, $route) {
							return httpService.getItem('users', $route.current.params.userId, true);
						}]
					}
				})
				.when('/accounts/add/new', {
					controller: 'UserCtrl',
					controllerAs: 'userViewModel',
					templateUrl: 'users/user.html',
					title: 'Create Account',
					resolve: {
						data: function () {
							return null;
						}
					}
				})
				.when('/topics', {
					controller: 'TopicsCtrl',
					controllerAs: 'topicsViewModel',
					templateUrl: 'topics/topics.html',
					title: 'Topics',
					resolve: {
						data: ['httpService', function(httpService) {
							return httpService.getCollection('topics', true);
						}]
					}
				})
				.otherwise({
					redirectTo: '/'
				});

			$authProvider.live({
				clientId: '000000004013AA1F',
				redirectUri: 'http://csgpro.dev:3000/auth/live',
				scope: ['wl.basic','wl.emails']
			});

		}]);
})();
