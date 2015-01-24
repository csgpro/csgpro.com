(function () {
    'use strict';

    angular.module('app')
        .controller('ModalGeneralCtrl', ModalGeneralCtrl);

    ModalGeneralCtrl.$inject = ['$modalInstance', 'data'];

    function ModalGeneralCtrl ($modalInstance, data) {
        var self = this;

        self.title = config.title || 'Information';

        self.content = config || 'No Data';
    }

})();
