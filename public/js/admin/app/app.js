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
