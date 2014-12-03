(function() {
	'use strict';

	angular.module('app')
	.controller('TopicCtrl', ['$modalInstance', 'common', function ($modalInstance, common) {

		var topicViewModel= this;

		topicViewModel.save = function () {
			var saveRecordData = {
				endpoint: 'topics',
				method: 'post',
				data: topicViewModel.topic,
				id: null,
				successMessage: 'Created Topic',
				onSuccess: function () {
					$modalInstance.close('created');
				}
			};
			common.saveRecord(saveRecordData);
		};

		topicViewModel.close = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);
})();
