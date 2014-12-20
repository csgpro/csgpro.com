(function() {
    'use strict';
    angular.module('app')
        .controller('NavCtrl', ['common', 'UserService', function (common, UserService) {
            var nav = this;
            nav.isCollapsed = true;
            nav.isActive = common.routeIsActive;

            nav.userLogged = function() {
				return UserService.getUser();
			};

            nav.isAdmin = function() {
                return UserService.IsAdmin();
            };

        }]);
})();
