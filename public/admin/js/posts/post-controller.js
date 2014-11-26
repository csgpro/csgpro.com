(function() {
	'use strict';

	angular.module('app')
		.controller('PostCtrl', ['data', 'common', 'lookup', '$modal', 'UserService', function(data, common, lookup, $modal, UserService) {
			var postViewModel = this;

			postViewModel.post = data ? data : {};

			postViewModel.expand = function() {
				common.autoExpandTextarea('Markdown');
			};

			lookup.getAvailableTopics().then(function(res) {
				postViewModel.availableTopics = res;
				postViewModel.selectedTopics = [];
				if(data && data.Topics) {
					var topics = data.Topics.split(',');
					for(var i = 0; i < topics.length; i++) {
						// Because ngRepeat and ngOptions don't play well together
						// when using string data.
						postViewModel.selectedTopics.push({
							id: i,
							Name: topics[i]
						});
					}
				} else {
					postViewModel.selectedTopics.push({
						id: 0,
						Name: ''
					})
				}
				postViewModel.post.Topics = '';
			});

			lookup.getAvailableCategories().then(function(res) {
				postViewModel.availableCategories = res;
			});

			lookup.getAvailableUsers().then(function(res) {
				postViewModel.availableUsers = res;
				postViewModel.post.AuthorUserId = UserService.UserId();
			});

			function getSelectedTopics() {
				// concat topics.
				var topics = [];
				for(var i = 0; i < postViewModel.selectedTopics.length; i++) {
					var topic = postViewModel.selectedTopics[i];
					if(topic.hasOwnProperty('Name') && topic.Name != '') {
						topics.push(topic.Name);
					}
				}
				return topics.join();
			}

			function getSaveRecordData() {
				postViewModel.post.Topics = getSelectedTopics();
				var data = {
					post: postViewModel.post
				};
				var saveRecordData = {
	                endpoint: 'posts',
	                method: 'post',
	                data: data,
	                id: postViewModel.post ? postViewModel.post.id : null,
	                successMessage: 'Created Post',
	                onSuccess: function () {
	                    common.goToUrl('/posts');
	                }
				};

				if (postViewModel.post.id) {
	                saveRecordData.method = 'put';
					saveRecordData.successMessage = 'Updated Post';
	            }
				return saveRecordData;
			}

			var toolbarButtons = {
				standardButtons: ['cancel'],
				customButtons: [
                    {
                        condition: function () {
                            return (UserService.IsAdmin() && postViewModel.post.id && !postViewModel.post.PublishDate);
                        },
                        clickFn: function () {
							var saveRecordData = getSaveRecordData();
                            saveRecordData.successMessage = 'Post Successfully Published';
							saveRecordData.data.post.PublishDate = new Date().getTime();
                            common.saveRecord(saveRecordData);
                        },
                        btnClass: 'btn-primary',
                        btnGlyph: 'glyphicon-ok',
                        btnText: 'Publish'
                    },
					{
						condition: function () {
							return (UserService.IsAdmin() && postViewModel.post.id && postViewModel.post.PublishDate);
						},
						clickFn: function () {
							var saveRecordData = getSaveRecordData();
							saveRecordData.successMessage = 'Post Un-Published';
							saveRecordData.data.post.PublishDate = null;
							common.saveRecord(saveRecordData);
						},
						btnClass: 'btn-danger',
						btnGlyph: 'glyphicon-remove',
						btnText: 'Un-Publish'
					},
					{
						condition: function () {
							return (!UserService.IsAdmin() && !postViewModel.post.PublishDate);
						},
						clickFn: function () {
							var saveRecordData = getSaveRecordData();
							saveRecordData.successMessage = 'Request Sent';
							saveRecordData.data.notify = true;
							common.saveRecord(saveRecordData);
						},
						btnClass: 'btn-info',
						btnGlyph: 'glyphicon-ok',
						btnText: 'Ready for Review'
					},
					{
						clickFn: function () {
							var saveRecordData = getSaveRecordData();
							common.saveRecord(saveRecordData);
						},
						btnClass: 'btn-success',
						btnGlyph: 'glyphicon-save',
						btnText: 'Save'
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

				modalInstance.result.then(function (data) {
					var image = '![' + data.description + '](' + data.url + ')';
					common.insertTextAtLastPos('Markdown', image);
				});
			};

		}]);
})();
