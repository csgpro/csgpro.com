(function() {
	'use strict';

	angular.module('app')
		.controller('LoginCtrl', ['$auth', function($auth) {
			var loginViewModel = this;

			loginViewModel.authenticate = function(provider) {
				$auth.authenticate(provider);
			};
		}]);
})();
