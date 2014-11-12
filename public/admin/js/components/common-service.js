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
                var routes = Array.isArray(r) ? r.join('|') : r,
                    regexStr = '\/(' + routes + ')',
                    path = new RegExp(regexStr);

                return (r[0] === $location.path()) ? true : path.test($location.path());
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
