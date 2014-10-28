(function() {
	'use strict';

	angular.module('app')
		.controller('ProfileCtrl', ['data', '$filter', '$upload', function(data, $filter, $upload) {
			// Do Awesome Stuff!
			var profileViewModel = this;

			profileViewModel.user = data;

			profileViewModel.user.CreateDateDisplay = $filter('date')(profileViewModel.user.CreateDate);

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

		}]);
})();
