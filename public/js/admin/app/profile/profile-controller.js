(function() {
	'use strict';

	angular.module('app')
		.controller('ProfileCtrl', ['data', '$filter', '$upload', 'common', function(data, $filter, $upload, common) {
			// Do Awesome Stuff!
			var profileViewModel = this;

			profileViewModel.user = {
				FullName: data.FullName,
				IsAdmin: data.IsAdmin,
				ProfileUrl: data.ProfileUrl,
				TwitterHandle: data.TwitterHandle,
				Username: data.Username
			}

			profileViewModel.user.CreateDateDisplay = $filter('date')(data.CreateDate);

			profileViewModel.onFileSelect = function($files) {
				for (var i = 0; i < $files.length; i++) {
					var file = $files[i];
					profileViewModel.upload = $upload.upload({
						url: '/upload/img/author',
						file: file
					}).progress(function(evt) {
						console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
					}).success(function(data, status, headers, config) {
						profileViewModel.user.ProfileUrl = data.url;
					});
				}
			};

			profileViewModel.canEdit = false;

			if (common.canEdit() > 0) {
                common.enableSaveButton = true;
                common.enableCancelButton = true;
                profileViewModel.canEdit = true;
            } else {
                common.enableEditButton = true;
                common.enableReturnButton = true;
            }

			common.setSaveRecordData({
				entity: 'users',
				item: profileViewModel.user,
				id: 'me'
			});

		}]);
})();
