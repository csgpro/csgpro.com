(function() {
	'use strict';

	angular.module('app')
		.controller('PostCtrl', ['data', 'common', 'lookup', '$timeout', function(data, common, lookup, $timeout) {
			var postViewModel = this;

			postViewModel.post = data;

			postViewModel.autoExpand = function(e,delay) {
				var element = typeof e === 'object' ? e.target : document.getElementById(e);
				if(delay) {
					$timeout(resize, delay);
				} else {
					resize();
				}
				function resize() {
					var scrollHeight = element.scrollHeight + 10;
					element.style.height =  scrollHeight + "px";
				}
			};

			function expand() {
				postViewModel.autoExpand('Markdown');
			}

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
                saveRecordData.method = 'patch';
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

		}]);
})();
