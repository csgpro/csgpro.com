(function() {
	'use strict';

	angular.module('app')
		.controller('ModalDeleteRecordCtrl', ['$modalInstance', 'config', 'httpService', 'notifications', function ($modalInstance, config, httpService, notifications) {

			var modalVM = this;

			modalVM.description = config.description;

			modalVM.delete = function () {
				httpService.deleteItem(config.endpoint, config.id).then(function (res) {
					if (res.errors) {
						notificatoins.showError(res.errors[0].title);
					} else {
						notifications.showWarning('Record Deleted');
						$modalInstance.close('deleted');
					}
				});
			};

			modalVM.close = function () {
				$modalInstance.dismiss('cancel');
			};
	}]);
})();
