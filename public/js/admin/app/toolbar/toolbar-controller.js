(function () {
    'use strict';
    angular.module('app')
        .controller('ToolbarCtrl', ['$scope','$rootScope','common', function ($scope, $rootScope, common) {
            $scope.saveRecord = function () { common.saveRecord(); };
            $scope.cancel = function () { common.cancel(); };
            $scope.addItem = function () { common.addItem(); };
            $scope.editItem = function () { common.editItem(); };
            $scope.returnToList = function () { common.returnToList(); };

            $scope.saveButtonEnabled = function () {
                return common.enableSaveButton;
            };

            $scope.cancelButtonEnabled = function () {
                return common.enableCancelButton;
            };

            $scope.addButtonEnabled = function () {
                return common.enableAddButton;
            };

            $scope.editButtonEnabled = function () {
                return common.enableEditButton;
            };

            $scope.returnButtonEnabled = function () {
                return common.enableReturnButton;
            };

        }]);
})();
