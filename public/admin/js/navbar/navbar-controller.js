(function() {
    'use strict';
    angular.module('app')
        .controller('NavCtrl', ['common', '$auth', function (common, $auth) {
            var nav = this;
            nav.isCollapsed = true;
            nav.isActive = common.routeIsActive;

            nav.userLogged = function() {
				return $auth.isAuthenticated();
			};

        }]);
})();
