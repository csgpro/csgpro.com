(function () {
	'use strict';

	angular.module('app')
		.controller('TopicsCtrl', ['common', 'data', '$scope', 'httpService', '$modal', function (common, data, $scope, httpService, $modal) {
			// Do Awesome Things

			var topicsViewModel = this;

			topicsViewModel.topics = data;

			topicsViewModel.goToTopic = function (topic) {
				window.open('/post/topic/' + topic.Name);
			};

			var cellButtons = '<div class="ngCellText"><button class="btn btn-xs btn-primary" ng-click="$parent.topicsViewModel.goToTopic(row.entity)" tooltip="View Topic" tooltip-placement="left"><span class="glyphicon glyphicon-search"></span></button> <button class="btn btn-xs btn-danger" ng-click="$parent.topicsViewModel.deleteTopic(row.entity)" tooltip="Delete Topic" tooltip-placement="left"><span class="glyphicon glyphicon-trash"></span></button></div>';

			// Set up datatable
			topicsViewModel.datatable = {
				data: 'topicsViewModel.topics',
				enableRowSelection: false,
				enableHighlighting: true,
				columnDefs: [
					{ field: 'Name', displayName: 'Name', enableCellEdit: true },
					{ width: 120, cellTemplate: cellButtons, cellClass: 'allowOverflow' }
				]
			};

			$scope.$on('ngGridEventEndCellEdit', function (data) {
				var topic = data.targetScope.row.entity;
				httpService.updateItem('topics', topic.id, topic);
			});

			/********************
			* Delete Record Modal
			*******************/
			topicsViewModel.deleteTopic = function (topic) {

				var modalInstance = $modal.open({
					templateUrl: 'modals/modal-delete-record.html',
					controller: 'ModalDeleteRecordCtrl',
					controllerAs: 'modalVM',
					size: 'md',
					resolve: {
						config: function () {
							return {
								endpoint: 'topics',
								id: topic.id,
								description: topic.Name
							};
						}
					}
				});

				modalInstance.result.then(function () {
					common.reload();
				});
			};

			/********************
			* Add Record Modal
			*******************/
			topicsViewModel.addTopic = function () {
				var modalInstance = $modal.open({
					templateUrl: 'topics/topic.html',
					controller: 'TopicCtrl',
					controllerAs: 'topicViewModel',
					size: 'md'
				});

				modalInstance.result.then(function () {
					common.reload();
				});
			};

			var toolbarButtons = {
				customButtons: [
				{
					clickFn: topicsViewModel.addTopic,
					btnClass: 'btn-primary',
					btnGlyph: 'glyphicon-plus'
				}
				]
			};

			common.setupToolbarButtons(toolbarButtons);

		}]);
})();
