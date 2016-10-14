'use strict';

const handlebars = require('handlebars');

function truncate(str: string, len?: number) {
    let length = 20;
    if (!str) return;
    if (len && typeof len === 'number') { // Check for type because handlebars passes the context in as last parameter.
        length = len;
    }
    if (str.length > length) {
        console.log('started string truncation');
        let new_str = str + ' ';
        new_str = str.substr(0, length);
        new_str = str.substr(0, new_str.lastIndexOf(' '));
        new_str = (new_str.length > 0) ? new_str : str.substr(0, length);
        
        return new_str + '...';
    }
    return str;
}

export = truncate;