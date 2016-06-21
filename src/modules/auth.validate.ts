import * as moment from 'moment';
import * as roles from './roles';

var validate = function(decoded, request, callback) {
    var userId = decoded.sub;
    
    var roleName = roles.roleByName[decoded.role];
    
    var credentials = {
        scope: [roleName],
        userId
    };
    
    var valid = ((userId > 0) && (decoded.exp >= moment().unix()));
    
    return callback(null, valid, credentials);
};

export = validate;