(function() {
	'use strict';

	angular.module('app')
	.controller('ModalRequestReviewCtrl', ['$modalInstance', function ($modalInstance) {

		var modalVM = this;

		modalVM.message = 'Please consider my post for publishing on CSG Pro\'s Blog.';

		modalVM.send = function () {
			$modalInstance.close({
				message: modalVM.message
			});
		};

		modalVM.close = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);
})();
