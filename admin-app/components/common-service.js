(function () {
    angular.module('app')
        .service('common', ['CONFIG', 'httpService', '$rootScope', '$location', 'notifications', '$filter', '$route', function (CONFIG, httpService, $rootScope, $location, notifications, $filter, $route) {

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
                if (str.substring(lastChar) === 's') {
                    resStr = str.substring(0, lastChar);
                }
                if (str.substring(lastThreeChar) === 'ies') {
                    resStr = str.substring(0, lastThreeChar) + 'y';
                }
                return resStr;
            };

            self.setSaveRecordData = function (obj) {
                delete self.saveRecordData;
                self.saveRecordData = obj;
            };

            self.saveRecord = function (data) {
                var saveRecordData = data ? data : self.saveRecordData;
                var endpoint = saveRecordData.endpoint,
                    data = saveRecordData.data,
                    id = saveRecordData.id,
                    method = saveRecordData.method,
                    successMessage = saveRecordData.successMessage ? saveRecordData.successMessage : 'Saved Data',
                    onSuccess = saveRecordData.onSuccess ? saveRecordData.onSuccess : null;

                if (method === 'put') {
                    return httpService.updateItem(endpoint, id, data).then(function (res) {
                        notifications.showSuccess(successMessage);
                        if (onSuccess) {
                            onSuccess();
                        }
                    },
                    function (res) {
                        notifications.showError(res);
                    });
                } else {
                    return httpService.createItem(endpoint, data).then(function (res) {
                        notifications.showSuccess(successMessage);
                        if (onSuccess) {
                            onSuccess();
                        }
                    },
                    function (res) {
                        notifications.showError(res);
                    });
                }
            };

            self.setCancel = function (method) {
                this.cancel = method;
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

            self.setReturnToList = function (method) {
                this.returnToList = method;
            };

            self.returnToList = function () {
                var path = $location.path();
                $location.url(path.substring(0, path.lastIndexOf('/')));
            };

            self.otherToolbarButtons = [];

            self.setupToolbarButtons = function (toolbarButtons) {
                if (typeof toolbarButtons === 'object') {
                    var i = 0;
                    var button;
                    if (toolbarButtons.standardButtons && toolbarButtons.standardButtons.length > 0) {
                        for (i in toolbarButtons.standardButtons) {
                            button = toolbarButtons.standardButtons[i];
                            switch (button) {
                                case 'save':
                                    self.enableSaveButton = true;
                                    break;
                                case 'edit':
                                    self.enableEditButton = true;
                                    break;
                                case 'add':
                                    self.enableAddButton = true;
                                    break;
                                case 'cancel':
                                    self.enableCancelButton = true;
                                    break;
                                case 'return':
                                    self.enableReturnButton = true;
                                    break;
                            }
                        }
                    }

                    if (toolbarButtons.customButtons && toolbarButtons.customButtons.length > 0) {
                        for (i = 0; i < toolbarButtons.customButtons.length; i++) {
                            button = toolbarButtons.customButtons[i];
                            if (!button.condition || button.condition()) {
                                self.otherToolbarButtons.push(button);
                            }
                        }
                    }
                }
            };

            self.goToUrl = function (url) {
                $location.url(url);
            };

            self.reload = function () {
                $route.reload();
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

            self.editItemRoute = null;

            self.setEditItemRoute = function (route) {
                self.editItemRoute = route;
            };

            self.editItem = function (route) {
                var editPath;
                if (route) {
                    editPath = $location.path() + '/' + route;
                } else if (self.editItemRoute) {
                    editPath = self.editItemRoute;
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
                this.returnToList = self.returnToList;
                this.secondaryNavTemplate = self.secondaryNavTemplate;
                this.currentViewTitle = self.currentViewTitle;
                this.editItemRoute = self.editItemRoute;
                this.otherToolbarButtons = [];
                this.currentParentEntityId = null;
            };

            self.canEdit = function () {
                var path = $location.path();
                var pattern = /\badd\b|\bedit\b/;
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

            self.currentSubPath = function (id) {
                var path = $location.path();
                var subPath = path.split(id).pop();
                return subPath;
            };

            self.setCurrentPageTitle = function (title) {
                $rootScope.pageTitle = title;
            };

            self.routeIsActive = function (r) {
                var routes = Array.isArray(r) ? r.join('|') : r,
                    regexStr = '\/(' + routes + ')',
                    path = new RegExp(regexStr);

                return (r[0] === $location.path()) ? true : path.test($location.path());
            };

            self.setScopeProperty = function (scope, property, getFunction) {
                // Prevent duplication of property
                if (!scope[property]) {
                    Object.defineProperty(scope, property, {
                        get: getFunction
                    });
                }
            };

            self.currentParentEntityId = null;

            self.getQueryStringParams = function () {

                var res = {};

                window.location.search.replace("?", "").split('&').map(

                function (q) {
                    var v = q.split('=');
                    res[v[0]] = v[1];
                });

                return res;
            };

            self.convertToCurrency = function (num) {
                if (parseFloat(num)) {
                    return $filter('currency')(num);
                }
                return num;
            };

            self.convertToDate = function (timestamp) {
                return $filter('date')(timestamp);
            };

            // http://smplctd.com/1r7k9PX
            self.insertTextAtLastPos = function (field, text) {
                var txtarea = document.getElementById(field);
                var scrollPos = txtarea.scrollTop;
                var strPos = 0;
                var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
                    "ff" : (document.selection ? "ie" : false ) );
                if (br == "ie") {
                    txtarea.focus();
                    var range = document.selection.createRange();
                    range.moveStart ('character', -txtarea.value.length);
                    strPos = range.text.length;
                }
                else if (br == "ff") strPos = txtarea.selectionStart;

                var front = (txtarea.value).substring(0,strPos);
                var back = (txtarea.value).substring(strPos,txtarea.value.length);
                txtarea.value=front+text+back;
                strPos = strPos + text.length;
                if (br == "ie") {
                    txtarea.focus();
                    var range = document.selection.createRange();
                    range.moveStart ('character', -txtarea.value.length);
                    range.moveStart ('character', strPos);
                    range.moveEnd ('character', 0);
                    range.select();
                }
                else if (br == "ff") {
                    txtarea.selectionStart = strPos;
                    txtarea.selectionEnd = strPos;
                    txtarea.focus();
                }
                txtarea.scrollTop = scrollPos;
                var event = new Event('change');
                txtarea.dispatchEvent(event);
            };

            self.autoExpandTextarea = function(e) {
				var element = typeof e === 'object' ? e.target : document.getElementById(e);
				setTimeout(function() {
					var scrollHeight = element.scrollHeight + 2;
					element.style.height =  scrollHeight + "px";
				}, 500);
			};

            return self;
        }]);
})();
