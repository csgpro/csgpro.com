(function() {
	'use strict';

	angular.module('app')
		.controller('NavbarCtrl', ['$location', '$auth', '$scope', function($location, $auth, $scope) {
			var navVM = this;

			navVM.isActive = function (r) {
                var routes = r.join('|'),
                    regexStr = '^\/(' + routes + ')',
                    path = new RegExp(regexStr);
                if(r[0] === 'home' && $location.path() === '/') {
                    return true;
                }
                return path.test($location.path());
            };

			navVM.isCollapsed = true;

			navVM.userLogged = function() {
				return $auth.isAuthenticated();
			};
		}]);
})();
