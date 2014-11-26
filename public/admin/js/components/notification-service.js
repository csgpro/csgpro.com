(function () {
    'use strict';

    angular.module('app')
        .service('notifications', ['toaster', '$window', function (toaster, $window) {

            var self = this;

            self.showError = function (msg) {
                toaster.pop('error', msg);
            };

            self.showWarning = function (msg) {
                toaster.pop('warning', msg);
            };

            self.showSuccess = function (msg) {
                toaster.pop('success', msg);
            };

            self.alert = function(msg) {
				$window.alert(msg);
			};

            return self;
        }]);
})();
