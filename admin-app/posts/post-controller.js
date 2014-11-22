(function() {
	'use strict';

	angular.module('app')
		.controller('PostCtrl', ['data', 'common', 'lookup', '$modal', function(data, common, lookup, $modal) {
			var postViewModel = this;

			postViewModel.post = data ? data : {};

			postViewModel.expand = function() {
				common.autoExpandTextarea('Markdown');
			};

			lookup.getAvailableTopics().then(function(res) {
				postViewModel.availableTopics = res;
				postViewModel.selectedTopics = data && data.Topics ? postViewModel.post.Topics.split(',') : [];
			});

			lookup.getAvailableCategories().then(function(res) {
				postViewModel.availableCategories = res;
			});

			lookup.getAvailableUsers().then(function(res) {
				postViewModel.availableUsers = res;
			});

			var saveRecordData = {
                endpoint: 'posts',
                method: 'post',
                data: postViewModel.post,
                id: postViewModel.post ? postViewModel.post.id : null,
                successMessage: 'Created Post',
                onSuccess: function () {
                    common.goToUrl('/posts');
                }
			};

			if (postViewModel.post) {
                saveRecordData.method = 'put';
				saveRecordData.successMessage = 'Updated Post';
            }

			common.setSaveRecordData(saveRecordData);

			var toolbarButtons = {
				standardButtons: ['save','cancel'],
				customButtons: [
                    {
                        condition: function () {
                            return (postViewModel.post && !postViewModel.post.PublishDate);
                        },
                        clickFn: function () {
                            saveRecordData.successMessage = 'Post Successfully Published';
							common.setSaveRecordData(saveRecordData);
                            common.saveRecord();
                        },
                        btnClass: 'btn-primary',
                        btnGlyph: 'glyphicon-ok',
                        btnText: 'Publish'
                    },
					{
						condition: function () {
							return (postViewModel.post && postViewModel.post.PublishDate);
						},
						clickFn: function () {
							saveRecordData.successMessage = 'Post Un-Published';
							common.setSaveRecordData(saveRecordData);
							common.saveRecord();
						},
						btnClass: 'btn-danger',
						btnGlyph: 'glyphicon-remove',
						btnText: 'Un-Publish'
					}
				]
			};

			common.setupToolbarButtons(toolbarButtons);
			common.setCancel(function() {
				common.goToUrl('/posts');
			});

			/********************
			 * Image Upload Modal
			 *******************/
			postViewModel.openImageUploadModal = function () {

				var modalInstance = $modal.open({
					templateUrl: 'modals/modal-file-upload.html',
					controller: 'ModalFileUploadCtrl',
					controllerAs: 'modalVM',
					size: 'sm',
					resolve: {
						config: function () {
							return {
								title: 'Upload Image',
								buttonLabel: 'Select Image File'
							};
						}
					}
				});

				modalInstance.result.then(function (file) {
					var image = '![image description](' + file + ')';
					common.insertTextAtLastPos('Markdown', image);
				});
			};

		}]);
})();
