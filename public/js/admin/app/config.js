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
