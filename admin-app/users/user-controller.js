(function() {
	'use strict';

	angular.module('app')
	.controller('UserCtrl', ['data', 'common', '$modal', 'UserService', function(data, common, $modal, UserService) {
		// Do Awesome Stuff!
		var userViewModel = this;

		userViewModel.user = data ? data : {};

		if (!userViewModel.user.ProfileUrl) {
			userViewModel.user.ProfileUrl = 'http://www.csgpro.com/img/author/csg_generic_icon.png';
		}

		userViewModel.canEdit = true;

		userViewModel.canEditAdminStatus = function () {
			var isAdmin = UserService.IsAdmin(),
				isLocalhost = common.isLocalhost();
			return (isLocalhost);
		};

		/*********************
		* Save Data
		********************/
		var userData = {
			user: userViewModel.user
		};
		var saveRecordData = {
			endpoint: 'users',
			method: data ? 'put' : 'post',
			data: userData,
			id: userViewModel.user.id,
			successMessage: data ? 'Profile Updated' : 'Successfully Created Account',
			onSuccess: function () {
				if(UserService.getUser().id !== userViewModel.user.id) {
					common.goToUrl('/accounts');
				}
			}
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
		userViewModel.openImageUploadModal = function () {

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
				userViewModel.user.ProfileUrl = file.url;
				if(data) {
					data.ProfileUrl = file.url;
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
						id: userViewModel.user.id,
						successMessage: 'Profile Image Updated'
					};
					common.saveRecord(saveRecordData);
				}
			});
		};

	}]);
})();
