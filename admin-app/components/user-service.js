(function() {
	'use strict';

	angular.module('app')
		.service('UserService', ['common', '$auth', function(common, $auth) {

			var self = this;

			self.isAdmin = false;

			self.setAdminStatus = function (status) {
				self.isAdmin = status;
			};

			self.getAdminStatus = function () {
				return self.isAdmin;
			};

			return self;

		}]);
})();
