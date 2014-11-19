(function() {
	'use strict';

	angular.module('app')
		.controller('ProfileCtrl', ['data', '$filter', '$upload', 'common', function(data, $filter, $upload, common) {
			// Do Awesome Stuff!
			var profileViewModel = this;

			profileViewModel.user = data;

			// profileViewModel.user = {
			// 	FullName: data.FullName,
			// 	IsAdmin: data.IsAdmin,
			// 	ProfileUrl: data.ProfileUrl,
			// 	TwitterHandle: data.TwitterHandle,
			// 	Username: data.Username
			// };

			profileViewModel.user.CreateDateDisplay = $filter('date')(data.CreateDate);

			profileViewModel.onFileSelect = function(file) {
				profileViewModel.upload = $upload.upload({
					url: '/upload/img/author',
					file: file
				}).success(function(data, status, headers, config) {
					profileViewModel.user.ProfileUrl = data.url;
				});
			};

			profileViewModel.canEdit = true;

			/*********************
             * Save Data
             ********************/
            var saveRecordData = {
                endpoint: 'users',
                method: 'put',
                data: profileViewModel.user,
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

		}]);
})();
