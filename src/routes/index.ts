'use strict';

import * as hapi from 'hapi';
import * as fs from 'fs';

export var routes: hapi.IRouteConfiguration[] = [];

fs.readdirSync(__dirname + '/').forEach((file) => {
    if (file === 'index.js') {
        return;
    }
    if (/\.js$/.test(file)) {
        let r: hapi.IRouteConfiguration | hapi.IRouteConfiguration[] = require(__dirname + '/' + file);
        if (Array.isArray(r)) {
            r.forEach(route => {
                routes.push(route);
            });
        } else {
            routes.push(r);
        }
    }
});