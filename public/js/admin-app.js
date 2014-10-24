(function() {
	'use strict';

	angular.module('app', [ 'site-config', 'satellizer', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection' ])
		.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
			$routeProvider
				.when('/', {
					controller: 'HomeCtrl',
					controllerAs: 'homeViewModel',
					templateUrl: 'home/home.html',
					title: 'Admin Dashboard'
				})
				.when('/posts', {
					controller: 'PostsCtrl',
					controllerAs: 'postsViewModel',
					templateUrl: 'posts/posts.html',
					title: 'Posts',
					resolve: {
						data: ['httpService', function(httpService) {
							return httpService.getCollection('posts');
						}]
					}
				})
				.when('/login', {
					controller: 'LoginCtrl',
					controllerAs: 'loginViewModel',
					templateUrl: 'login/login.html',
					title: 'Login'
				})
				.otherwise({
					redirectTo: '/'
				});

			$authProvider.twitter({
		      url: '/auth/twitter/callback'
		    });

		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('AppCtrl', ['$rootScope', '$route', function($rootScope, $route) {
			var appViewModel = this;

			appViewModel.pageTitle = 'Loading...';

			$rootScope.$on('$routeChangeSuccess', function () {
				appViewModel.pageTitle = $route.current.title;
			});
		}]);
})();

(function() {
    'use strict';

    angular.module('site-config',[]);

    var configData = {
        'CONFIG': {
            'APP_VERSION': '1.0.0',
            'API_URL': '/api/admin/',
        }
    };
    angular.forEach(configData, function(key,value) {
        angular.module('site-config').constant(value,key);
        // Load config constants
    });

})();

(function() {
	'use strict';

	angular.module('app')
		.controller('HomeCtrl', [function() {
			// Do Awesome Stuff!
			var homeViewModel = this;

		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('LoginCtrl', ['$auth', function($auth) {
			var loginViewModel = this;

			loginViewModel.authenticate = function(provider) {
				$auth.authenticate(provider).then(function() {
					var hasAuth = $auth.isAuthenticated();
					console.log(hasAuth);
				});
			}
		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('NavbarCtrl', ['$location', function($location) {
			var navVM = this;

			navVM.isActive = function (r) {
                var routes = r.join('|'),
                    regexStr = '^\/(' + routes + ')',
                    path = new RegExp(regexStr);
                if(r[0] === 'home' && $location.path() === '/') {
                    return true;
                }
                return path.test($location.path());
            };

			navVM.isCollapsed = true;
		}]);
})();

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
				return '<div class="grid-actions ui-grid-cell-contents"><button class="btn btn-xs btn-primary" ng-click="getExternalScopes().gridRowSelectAction(row)"><span class="glyphicon glyphicon-pencil"></span> Edit</button></div>';
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

(function () {
	'use strict';

	angular.module('app')
		.service('httpService', ['$http','CONFIG','$rootScope', function($http, CONFIG, $rootScope) {

			var baseApiUrl = CONFIG.API_URL;

			return ({
				setAuthHeader: setAuthHeader,
				getCollection: getCollection,
				getItem: getItem,
				createItem: createItem,
				updateItem: updateItem,
				deleteItem: deleteItem
			});

			function setAuthHeader(authStr) {
				$http.defaults.headers.common.Authorization = authStr;
			}

			function getCollection(entity) {

				var url = baseApiUrl + entity;

				var request = $rootScope.loadingData = $http({
					method: "get",
					url: url
				});

				return (request.then(handleSuccess, handleError));

			}

			function getItem(entity,id) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "get",
					url: url
				});

				return (request.then(handleSuccess, handleError));
			}

			function createItem(entity,data) {

				var url = baseApiUrl + entity;

				var request = $rootScope.loadingData = $http({
					method: "post",
					url: url,
					data: data
				});

				return (request.then(handleSuccess, handleError));
			}

			function updateItem(entity,id,data) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "put",
					url: url,
					data: data
				});

				return (request.then(handleSuccess, handleError));
			}

			function deleteItem(entity,id) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "delete",
					url: url
				});

				return (request.then(handleSuccess, handleError));
			}

			function handleError(response) {
				return (response.message);
			}

			function handleSuccess(response) {
				return (response.data);
			}
		}]);
})();
