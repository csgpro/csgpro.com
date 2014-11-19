(function() {
	'use strict';

	angular.module('app')
		.controller('PostsCtrl', ['common', 'data', function(common, data) {
			// Do Awesome Stuff!
			var postsViewModel = this;

			postsViewModel.posts = data;

			postsViewModel.CreateDateDisplay = common.convertToDate(data.CreateDate);
			postsViewModel.PublishDateDisplay = common.convertToDate(data.PublishDate);

			postsViewModel.goToPost = function (post) {
				common.goToUrl('/posts/' + post.id);
			};

			var cellButtons = '<div class="ngCellText"><button class="btn btn-xs btn-primary" ng-click="$parent.postsViewModel.goToPost(row.entity)" tooltip="View Post" tooltip-placement="left"><span class="glyphicon glyphicon-search"></span></button></div>';

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

		}]);
})();
