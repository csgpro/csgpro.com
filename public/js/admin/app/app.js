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
