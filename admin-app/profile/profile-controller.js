(function() {
	'use strict';

	angular.module('app')
		.controller('ProfileCtrl', ['data', 'common', '$modal', function(data, common, $modal) {
			// Do Awesome Stuff!
			var profileViewModel = this;

			profileViewModel.user = data;

			profileViewModel.canEdit = true;

			/*********************
             * Save Data
             ********************/
			var userData = {
				user: profileViewModel.user
			};
            var saveRecordData = {
                endpoint: 'users',
                method: 'put',
                data: userData,
                id: 'me',
                successMessage: 'Profile Updated'
            };

			common.setSaveRecordData(saveRecordData);

            /*********************
             * Setup Toolbar Buttons
             ********************/
            var toolbarButtons = {
                standardButtons: ['save', 'cancel']
            };

			common.setupToolbarButtons(toolbarButtons);

			/********************
			 * Image Upload Modal
			 *******************/
			profileViewModel.openImageUploadModal = function () {

				var modalInstance = $modal.open({
					templateUrl: 'modals/modal-file-upload.html',
					controller: 'ModalFileUploadCtrl',
					controllerAs: 'modalVM',
					size: 'sm',
					resolve: {
						config: function () {
							return {
								title: 'Upload Photo',
								buttonLabel: 'Select Photo',
								showDescriptionField: false
							};
						}
					}
				});

				modalInstance.result.then(function (file) {
					profileViewModel.user.ProfileUrl = data.ProfileUrl = file.url;
					/*********************
		             * Save Data
		             ********************/
					var userData = {
						user: data
					};
		            var saveRecordData = {
		                endpoint: 'users',
		                method: 'put',
		                data: userData,
		                id: 'me',
		                successMessage: 'Profile Image Updated'
		            };
					common.saveRecord(saveRecordData);
				});
			};

		}]);
})();
