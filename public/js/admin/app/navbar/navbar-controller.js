(function() {
	'use strict';

	angular.module('app')
		.controller('NavbarCtrl', ['$location', function($location) {
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
		}]);
})();
