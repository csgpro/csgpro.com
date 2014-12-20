(function() {
	'use strict';
	
	angular.module('app')
		.controller('UsersCtrl', ['common', 'data', '$modal', function(common, data, $modal) {
			// Do Awesome Things

			var usersViewModel = this;

			usersViewModel.users = data;

			usersViewModel.goToUser = function (user, mode) {
				if(mode === 'edit') {
					common.goToUrl('/accounts/edit/' + user.id);
				} else {
					window.open('/post?q=' + user.FullName, 'preview');
				}
			};

			var cellButtons = '<div class="ngCellText"><button class="btn btn-xs btn-primary" ng-click="$parent.usersViewModel.goToUser(row.entity, \'edit\')" tooltip="Edit User" tooltip-placement="left"><span class="glyphicon glyphicon-pencil"></span></button> <button class="btn btn-xs btn-primary" ng-click="$parent.usersViewModel.goToUser(row.entity)" tooltip="View Users Posts" tooltip-placement="left"><span class="glyphicon glyphicon-search"></span></button> <button class="btn btn-xs btn-danger" ng-click="$parent.usersViewModel.deleteUser(row.entity)" tooltip="Delete User" tooltip-placement="left"><span class="glyphicon glyphicon-trash"></span></button></div>';

			// Set up datatable
			usersViewModel.datatable = {
				data: 'usersViewModel.users',
				enableRowSelection: false,
				enableHighlighting: true,
				columnDefs: [
				{ field: 'Username', displayName: 'Username', width: 100 },
				{ field: 'FullName', displayName: 'Full Name' },
				{ field: 'TwitterHandle', displayName: 'TwitterHandle', width: 150 },
				{ width: 120, cellTemplate: cellButtons, cellClass: 'allowOverflow' }
				]
			};

			var toolbarButtons = {
				standardButtons: ['add']
			};

			common.setupToolbarButtons(toolbarButtons);

			/********************
			* Delete Record Modal
			*******************/
			usersViewModel.deleteUser = function (user) {

				var modalInstance = $modal.open({
					templateUrl: 'modals/modal-delete-record.html',
					controller: 'ModalDeleteRecordCtrl',
					controllerAs: 'modalVM',
					size: 'md',
					resolve: {
						config: function () {
							return {
								endpoint: 'users',
								id: user.id,
								description: user.FullName
							};
						}
					}
				});

				modalInstance.result.then(function () {
					common.reload();
				});
			};
		}]);
})();
