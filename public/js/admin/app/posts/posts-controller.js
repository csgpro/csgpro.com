(function() {
	'use strict';

	angular.module('app')
		.controller('PostsCtrl', ['data', '$timeout', function(data, $timeout) {
			// Do Awesome Stuff!
			var postsViewModel = this;

			postsViewModel.posts = data;

			postsViewModel.gridRowSelectAction = function(row) {
				alert('id: ' + row.entity.id);
			};

			var editCell = function () {
				return '<div><button class="btn btn-xs btn-primary" ng-click="getExternalScopes().gridRowSelectAction(row)"><span class="glyphicon glyphicon-pencil"></span> Edit</button></div>';
			};

			postsViewModel.gridOptions = {
				data: postsViewModel.posts,
				columnDefs: [
					{ name: 'id', width: '70' },
					{ name: 'AuthorUsername', width: '100' },
					{ name: 'Title' },
					{ name: 'Topics', width: '100' },
					{ name: 'Category', width: '100' },
					{ name: 'PublishDate', width: '100' },
					{ name: 'UpdateDate', width: '100' },
					{ name: 'Actions', width: '100', cellTemplate: editCell() }
				],
				rowTemplate: 'partials/clickable-row.html'
			};

		}]);
})();
