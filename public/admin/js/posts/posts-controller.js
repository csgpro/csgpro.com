(function() {
	'use strict';

	angular.module('app')
		.controller('PostsCtrl', ['common', 'data', 'notifications', function(common, data, notifications) {
			// Do Awesome Stuff!
			var postsViewModel = this;

			postsViewModel.posts = data;

			postsViewModel.alert = function(msg) {
				notifications.alert(msg);
			};

			postsViewModel.goToPost = function (post, mode) {
				if(mode === 'edit') {
					common.goToUrl('/posts/edit/' + post.id);
				} else {
					window.open('/post/' + post.id, 'preview');
				}
			};

			var cellButtons = '<div class="ngCellText"><button class="btn btn-xs btn-primary" ng-click="$parent.postsViewModel.goToPost(row.entity, \'edit\')" tooltip="Edit Post" tooltip-placement="left"><span class="glyphicon glyphicon-pencil"></span></button> <button class="btn btn-xs btn-primary" ng-click="$parent.postsViewModel.goToPost(row.entity)" tooltip="View Post" tooltip-placement="left"><span class="glyphicon glyphicon-search"></span></button> <button class="btn btn-xs btn-danger" ng-click="$parent.postsViewModel.alert(\'Not Yet Implemented\')" tooltip="Delete Post" tooltip-placement="left"><span class="glyphicon glyphicon-trash"></span></button></div>';

			// Set up datatable
		    postsViewModel.datatable = {
		        data: 'postsViewModel.posts',
		        enableRowSelection: false,
		        enableHighlighting: true,
		        columnDefs: [
	                { field: 'AuthorFullName', displayName: 'Author', width: 100 },
	                { field: 'Title', displayName: 'Title' },
	                { field: 'Topics', displayName: 'Topics', width: 150 },
					{ field: 'Category', displayName: 'Category', width: 100 },
					{ field: 'CreateDate', displayName: 'Created', width: 100, cellFilter: 'date:"M/d/yyyy"' },
					{ field: 'PublishDate', displayName: 'Published', width: 100, cellFilter: 'date:"M/d/yyyy"' },
	                { width: 120, cellTemplate: cellButtons, cellClass: 'allowOverflow' }
		        ]
		    };

			var toolbarButtons = {
				standardButtons: ['add']
			};

			common.setupToolbarButtons(toolbarButtons);

		}]);
})();
