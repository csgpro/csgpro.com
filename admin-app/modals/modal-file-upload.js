(function() {
	'use strict';

	angular.module('app')
		.controller('ModalFileUploadCtrl', ['$modalInstance', 'config', '$upload', function ($modalInstance, config, $upload) {

			var modalVM = this;

			modalVM.title = config && config.title ? config.title : 'Upload File';
			modalVM.buttonLabel = config && config.buttonLabel ? config.buttonLabel : 'Select File';

			modalVM.onFileSelect = function(file) {
				modalVM.upload = $upload.upload({
					url: '/upload/img/post',
					file: file
				}).success(function(data, status, headers, config) {
					$modalInstance.close(data.url);
				});
			};

			modalVM.close = function () {
				$modalInstance.dismiss('cancel');
			};
	}]);
})();
