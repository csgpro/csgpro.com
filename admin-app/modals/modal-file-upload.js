(function() {
	'use strict';

	angular.module('app')
		.controller('ModalFileUploadCtrl', ['$modalInstance', 'config', '$upload', function ($modalInstance, config, $upload) {

			var modalVM = this;

			modalVM.uploading = false; // Not uploading yet.

			modalVM.title = config && config.title ? config.title : 'Upload File';
			modalVM.buttonLabel = config && config.buttonLabel ? config.buttonLabel : 'Select File';

			modalVM.onFileSelect = function(file) {
				modalVM.upload = $upload.upload({
					url: '/upload/img/post',
					file: file
				}).progress(function(evt) {
					modalVM.uploading = true;
				}).success(function(data, status, headers, config) {
					$modalInstance.close({
						url: data.url,
						description: modalVM.description
					});
				});
			};

			modalVM.cancel = function () {
				$modalInstance.dismiss('cancel');
				if(modalVM.upload) {
					modalVM.upload.abort();
				}
			};
	}]);
})();
