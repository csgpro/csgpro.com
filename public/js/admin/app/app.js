(function() {
	'use strict';

	angular.module('app', [ 'site-config', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection' ])
		.config(['$routeProvider', function($routeProvider) {
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
				.otherwise({
					redirectTo: '/'
				})
		}]);
})();
