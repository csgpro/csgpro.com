(function() {
	'use strict';

	angular.module('app', [ 'site-config', 'satellizer', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngGrid', 'angularFileUpload', 'toaster', 'cgBusy' ])
		.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
			$routeProvider
				.when('/', {
					controller: 'HomeCtrl',
					controllerAs: 'homeViewModel',
					templateUrl: 'home/home.html',
					title: 'Admin Dashboard',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if (!$auth.isAuthenticated()) {
								return $location.path('/login');
							}
						}]
					}
				})
				.when('/posts', {
					controller: 'PostsCtrl',
					controllerAs: 'postsViewModel',
					templateUrl: 'posts/posts.html',
					title: 'Posts',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if (!$auth.isAuthenticated()) {
								return $location.path('/login');
							}
						}],
						data: ['httpService', function(httpService) {
							return httpService.getCollection('posts');
						}]
					}
				})
				.when('/login', {
					controller: 'LoginCtrl',
					controllerAs: 'loginViewModel',
					templateUrl: 'login/login.html',
					title: 'Login',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if($auth.isAuthenticated()) {
								return $location.path('/');
							}
						}]
					}
				})
				.when('/logout', {
					controller: 'LoginCtrl',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if ($auth.isAuthenticated()) {
								$auth.logout().then(function() {
									return $location.path('/');
								});
							}
						}]
					}
				})
				.when('/profile', {
					controller: 'ProfileCtrl',
					controllerAs: 'profileViewModel',
					templateUrl: 'profile/profile.html',
					title: 'Profile',
					resolve: {
						authenticated: ['$location', '$auth', function($location, $auth) {
							if (!$auth.isAuthenticated()) {
								return $location.path('/login');
							}
						}],
						data: ['httpService', function(httpService) {
							return httpService.getItem('users', 'me');
						}]
					}
				})
				.otherwise({
					redirectTo: '/'
				});

			$authProvider.twitter({
		      url: '/auth/twitter'
		    });

		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('AppCtrl', ['$rootScope', '$route', 'common', function($rootScope, $route, common) {
			var appViewModel = this;

			$rootScope.$on('$routeChangeSuccess', function () {
				appViewModel.pageTitle = $rootScope.pageTitle = $route.current.title;
				common.toolbarReset();
			});
		}]);
})();

(function () {
    angular.module('app')
        .service('common', ['CONFIG', 'httpService', '$rootScope', '$location', 'toaster', function (CONFIG, httpService, $rootScope, $location, toaster) {

            var self = this;

            self.enableAddButton = false;
            self.enableEditButton = false;
            self.enableSaveButton = false;
            self.enableCancelButton = false;
            self.enableReturnButton = false;

            self.upperCaseString = function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };

            self.singularString = function (str) {
                var lastChar = str.length - 1;
                var lastThreeChar = str.length - 3;
                var resStr = '';
                if(str.substring(lastChar) === 's') {
                    resStr = str.substring(0,lastChar);
                }
                if (str.substring(lastThreeChar) === 'ies') {
                    resStr = str.substring(0, lastThreeChar) + 'y';
                }
                return resStr;
            };

            self.saveRecordData = {};

            self.setSaveRecordData = function (obj) {
                self.saveRecordData = obj;
            };

            self.saveRecord = function () {
                var entity = self.saveRecordData.entity;
                var item = self.saveRecordData.item;
                var id = self.saveRecordData.id;
                var route;
                var data = {},
                    singularItemDisplayName = self.upperCaseString(self.singularString(entity));

                data[entity] = [item];

                if (id) {
                    httpService.updateItem(entity, id, data).then(function (item) {
                        // Output success message
                        toaster.pop('success', 'Saved ' + singularItemDisplayName);

                        if(entity === 'users') {
                            route = 'profile'
                        } else {
                            route = entity;
                        }

                        $location.url('/' + route);
                    });
                } else {
                    httpService.createItem(entity, data).then(function (res) {
                        if (res.status) {
                            toaster.pop('error', 'There was a problem creating the ' + singularItemDisplayName);
                        } else {
                            // Output success message
                            toaster.pop('success', 'Created New ' + singularItemDisplayName);
                            $location.url('/' + entity);
                        }
                    });
                }
            };

            self.cancel = function () {
                var id = $location.path().split('/').pop();
                var path = $location.path();
                var pattern = /\badd\b|\bedit\b/;
                var end = path.search(pattern);
                if (parseInt(id) >= 0) {
                    $location.url(path.substring(0, end) + id);
                } else {
                    $location.url(path.substring(0, end));
                }
            };

            self.returnToList = function () {
                var path = $location.path();
                $location.url(path.substring(0, path.lastIndexOf('/')));
            };

            self.goToUrl = function (url) {
                console.log(url);
                $location.url(url);
            };

            self.viewItem = function (subpath) {
                $location.url($location.path() + '/' + subpath);
            };

            self.deleteItem = function (entity, id, itemArray) {
                httpService.deleteItem(entity, id).then(itemArray.splice(this.$index, 1));
            };

            self.removeItem = function (itemArray) {
                itemArray.splice(this.$index, 1);
            };

            self.addItem = function (route) {
                // Add launch add view
                if (!route) {
                    route = '';
                }
                $location.url($location.path() + route + '/add/new');
            };

            self.editItem = function (route) {
                var editPath;
                if (route) {
                    editPath = $location.path() + '/' + route;
                } else {
                    var id = $location.path().split('/').pop();
                    editPath = $location.path().substring(0, $location.path().lastIndexOf('/')) + '/edit/' + id;
                }
                $location.url(editPath);
            };

            self.toolbarReset = function () {
                this.saveRecord = self.saveRecord;
                this.cancel = self.cancel;
                this.deleteItem = self.deleteItem;
                this.viewItem = self.viewItem;
                this.enableAddButton = false;
                this.enableEditButton = false;
                this.enableSaveButton = false;
                this.enableCancelButton = false;
                this.enableReturnButton = false;
                this.secondaryNavTemplate = self.secondaryNavTemplate;
                this.currentParentEntityId = self.currentParentEntityId;
                this.currentViewTitle = self.currentViewTitle;
            };

            self.canEdit = function () {
                var path = $location.path();
                var pattern = /\badd\b|\bedit\b|\bprofile\b/;
                return path.search(pattern);
            };

            self.revealButtons = function () {
                if (self.canEdit() > 0) {
                    self.enableSaveButton = true;
                    self.enableCancelButton = true;
                } else {
                    self.enableEditButton = true;
                    self.enableReturnButton = true;
                }
            };

            self.secondaryNavTemplate = null;

            self.currentParentEntityId = null;

            self.currentSubPath = function (id) {
                var path = $location.path();
                var subPath = path.split(id).pop();
                return subPath;
            };

            self.setCurrentPageTitle = function (title) {
                $rootScope.pageTitle = title + ' ' + $rootScope.pageTitle;
            };

            self.routeIsActive = function (r) {
                var routes = r.join('|'),
                    regexStr = '\/(' + routes + ')',
                    path = new RegExp(regexStr);

                return path.test($location.path());
            };

            self.getSiteCode = function (site) {
                if (site.state && site.city && site.name) {
                    var state = site.state.replace(/\s/g, '').substr(0, 2),
                        city = site.city.replace(/\s/g, '').substr(0, 4),
                        name = site.name.replace(/\s/g, '');
                    return (state + '-' + city + '-' + name).toUpperCase();
                }
            };

            self.setScopeProperty = function (scope, property, getFunction) {
                // Prevent duplication of property
                if (!scope[property]) {
                    Object.defineProperty(scope, property, {
                        get: getFunction
                    });
                }
            };

            return ({
                setCurrentPageTitle: self.setCurrentPageTitle,
                setSaveRecordData: self.setSaveRecordData,
                saveRecord: self.saveRecord,
                cancel: self.cancel,
                returnToList: self.returnToList,
                viewItem: self.viewItem,
                deleteItem: self.deleteItem,
                removeItem: self.removeItem,
                addItem: self.addItem,
                editItem: self.editItem,
                goToUrl: self.goToUrl,
                canEdit: self.canEdit,
                currentParentEntityId: self.currentParentEntityId,
                currentSubPath: self.currentSubPath,
                toolbarReset: self.toolbarReset,
                enableAddButton: self.enableAddButton,
                enableEditButton: self.enableEditButton,
                enableSaveButton: self.enableSaveButton,
                enableCancelButton: self.enableCancelButton,
                enableReturnButton: self.enableReturnButton,
                revealButtons: self.revealButtons,
                secondaryNavTemplate: self.secondaryNavTemplate,
                upperCaseString: self.upperCaseString,
                singularString: self.singularString,
                routeIsActive: self.routeIsActive,
                getSiteCode: self.getSiteCode,
                setScopeProperty: self.setScopeProperty
            });
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
					method: "patch",
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

(function() {
    'use strict';

    angular.module('site-config',[]);

    var configData = {
        'CONFIG': {
            'APP_VERSION': '1.0.0',
            'API_URL': '/api/',
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
		.controller('HomeCtrl', ['common', function(common) {
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
				$auth.authenticate(provider);
			}
		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('NavbarCtrl', ['$location', '$auth', '$scope', function($location, $auth, $scope) {
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

			navVM.userLogged = function() {
				return $auth.isAuthenticated();
			};
		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('PostsCtrl', ['data', '$timeout', function(data, $timeout) {
			// Do Awesome Stuff!
			var postsViewModel = this;

			postsViewModel.posts = data;

			// postsViewModel.gridRowSelectAction = function(row) {
			// 	alert('id: ' + row.entity.id);
			// };
			//
			// var editCell = function () {
			// 	return '<div class="grid-actions ui-grid-cell-contents"><button class="btn btn-xs btn-primary" ng-click="getExternalScopes().gridRowSelectAction(row)"><span class="glyphicon glyphicon-pencil"></span> Edit</button></div>';
			// };
			//
			// postsViewModel.gridOptions = {
			// 	data: postsViewModel.posts,
			// 	columnDefs: [
			// 		{ name: 'id', width: '70' },
			// 		{ name: 'AuthorUsername', width: '100' },
			// 		{ name: 'Title' },
			// 		{ name: 'Topics', width: '100' },
			// 		{ name: 'Category', width: '100' },
			// 		{ name: 'PublishDate', width: '100' },
			// 		{ name: 'UpdateDate', width: '100' },
			// 		{ name: 'Actions', width: '100', cellTemplate: editCell() }
			// 	],
			// 	rowTemplate: 'partials/clickable-row.html'
			// };

		}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('ProfileCtrl', ['data', '$filter', '$upload', 'common', function(data, $filter, $upload, common) {
			// Do Awesome Stuff!
			var profileViewModel = this;

			profileViewModel.user = {
				FullName: data.FullName,
				IsAdmin: data.IsAdmin,
				ProfileUrl: data.ProfileUrl,
				TwitterHandle: data.TwitterHandle,
				Username: data.Username
			}

			profileViewModel.user.CreateDateDisplay = $filter('date')(data.CreateDate);

			profileViewModel.onFileSelect = function($files) {
				for (var i = 0; i < $files.length; i++) {
					var file = $files[i];
					profileViewModel.upload = $upload.upload({
						url: '/upload/img/author',
						file: file
					}).progress(function(evt) {
						console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
					}).success(function(data, status, headers, config) {
						profileViewModel.user.ProfileUrl = data.url;
					});
				}
			};

			profileViewModel.canEdit = false;

			if (common.canEdit() > 0) {
                common.enableSaveButton = true;
                common.enableCancelButton = true;
                profileViewModel.canEdit = true;
            } else {
                common.enableEditButton = true;
                common.enableReturnButton = true;
            }

			common.setSaveRecordData({
				entity: 'users',
				item: profileViewModel.user,
				id: 'me'
			});

		}]);
})();

(function () {
    'use strict';
    angular.module('app')
        .controller('ToolbarCtrl', ['$rootScope','common', function ($rootScope, common) {

            var toolbar = this;

            toolbar.saveRecord = function () { common.saveRecord(); };
            toolbar.cancel = function () { common.cancel(); };
            toolbar.addItem = function () { common.addItem(); };
            toolbar.editItem = function () { common.editItem(); };
            toolbar.returnToList = function () { common.returnToList(); };

            toolbar.saveButtonEnabled = function () {
                return common.enableSaveButton;
            };

            toolbar.cancelButtonEnabled = function () {
                return common.enableCancelButton;
            };

            toolbar.addButtonEnabled = function () {
                return common.enableAddButton;
            };

            toolbar.editButtonEnabled = function () {
                return common.enableEditButton;
            };

            toolbar.returnButtonEnabled = function () {
                return common.enableReturnButton;
            };

        }]);
})();
