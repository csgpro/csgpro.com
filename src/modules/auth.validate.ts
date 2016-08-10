import * as moment from 'moment';
import * as roles from './roles';

let validate = function(decoded, request, callback) {
    let userId = decoded.sub;
    
    let roleName = roles.roleByName[decoded.role];
    
    let credentials = {
        scope: [roleName],
        userId
    };
    
    let valid = ((userId > 0) && (decoded.exp >= moment().unix()));
    
    return callback(null, valid, credentials);
};

export = validate;