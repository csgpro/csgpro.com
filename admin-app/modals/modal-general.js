(function () {
    'use strict';

    angular.module('app')
        .controller('ModalGeneralCtrl', ModalGeneralCtrl);

    ModalGeneralCtrl.$inject = ['$modalInstance', 'data'];

    function ModalGeneralCtrl ($modalInstance, data) {
        var self = this;

        self.title = data.title || 'Information';

        self.content = data.body || 'No Data';

        self.close = function () {
            $modalInstance.dismiss('cancel');
        };
    }

})();
