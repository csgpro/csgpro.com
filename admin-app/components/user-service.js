(function() {
	'use strict';

	angular.module('app')
		.service('UserService', ['common', '$auth', function(common, $auth) {

			var self = this;

			self.user = null;

			self.setUser = function (user) {
				self.user = user;
			};

			self.getUser = function () {
				return self.user;
			};

			self.IsAdmin = function () {
				return self.user && self.user.hasOwnProperty('IsAdmin') ? self.user.IsAdmin : false;
			};

			self.UserId = function () {
				return self.user.id;
			};

			return self;

		}]);
})();
