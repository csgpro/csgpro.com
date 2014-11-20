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

				postViewModel.selectedTopics = postViewModel.post.Topics? postViewModel.post.Topics.split(',') : ['']; // Assign values after lookups are added
			});



			//$timeout(expand, 0);

		}]);
})();
