(function () {
    'use strict';

    angular.module('app')
        .service('notifications', ['common', 'toaster', function (common, toaster) {

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

            return ({
                showError: self.showError,
                showWarning: self.showWarning,
                showSuccess: self.showSuccess
            });
        }]);
})();
