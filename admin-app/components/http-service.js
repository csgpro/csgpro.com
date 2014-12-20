(function () {
    'use strict';

    angular.module('app')
		.factory('httpService', ['$q', '$http', 'CONFIG', '$rootScope', function ($q, $http, CONFIG, $rootScope) {

		    var baseApiUrl = CONFIG.API_URL + 'api/';

		    function setAuthHeader(authStr) {
		        $http.defaults.headers.common.Authorization = authStr;
		    }

		    function getCollection(entity, showLoading) {

		        var url = baseApiUrl + entity,
                    request,
                    reqObj = {
                        method: 'get',
                        url: url
                    };

		        if (showLoading) {
		            request = $rootScope.loadingData = $http(reqObj);
		        } else {
		            request = $http(reqObj);
		        }

		        return (request.then(handleSuccess, handleError));

		    }

		    function getItem(entity, id, showLoading) {

		        var url = baseApiUrl + entity + '/' + id,
                    request,
                    reqObj = {
                        method: 'get',
                        url: url
                    };

		        if (showLoading) {
		            request = $rootScope.loadingData = $http(reqObj);
		        } else {
		            request = $http(reqObj);
		        }

		        return (request.then(handleSuccess, handleError));
		    }

		    function createItem(entity, data, showLoading) {

		        var url = baseApiUrl + entity,
                    request,
                    reqObj = {
                        method: 'post',
                        url: url,
                        data: data
                    };

		        if (showLoading) {
		            request = $rootScope.loadingData = $http(reqObj);
		        } else {
		            request = $http(reqObj);
		        }

		        return (request.then(handleSuccess, handleError));
		    }

		    function updateItem(entity, id, data, showLoading) {

		        var url = baseApiUrl + entity + '/' + id,
                    request,
                    reqObj = {
                        method: 'patch',
                        url: url,
                        data: data
                    };

		        if (showLoading) {
		            request = $rootScope.loadingData = $http(reqObj);
		        } else {
		            request = $http(reqObj);
		        }

		        return (request.then(handleSuccess, handleError));
		    }

		    function deleteItem(entity, id, showLoading) {

		        var url = baseApiUrl + entity + '/' + id,
                    request,
                    reqObj = {
                        method: 'delete',
                        url: url
                    };

                if (showLoading) {
		            request = $rootScope.loadingData = $http(reqObj);
                } else {
                    request = $http(reqObj);
                }

		        return (request.then(handleSuccess, handleError));
		    }

		    function handleError(response) {
		        if (!angular.isObject(response.data) || !response.data.message) {
		            if (angular.isArray(response.data.errors)) {
                        return( response.data );
		            }
		            if (response.statusText) {
		                return ($q.reject(response.statusText));
		            }
                    return( $q.reject( 'An unknown error occurred.' ) );
		        }
                return( $q.reject( response.data.message ) );
		    }

		    function handleSuccess(response) {
		        return (response.data);
		    }

            return ({
                setAuthHeader: setAuthHeader,
                getCollection: getCollection,
                getItem: getItem,
                createItem: createItem,
                updateItem: updateItem,
                deleteItem: deleteItem
            });
		}]);
})();
